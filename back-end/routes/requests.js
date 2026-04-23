const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const MeetingRequest = require("../models/MeetingRequest");
const StudySync = require("../models/StudySync");

// GET /api/requests - retrieve pending meeting requests sent TO the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || "";

    // Find all pending requests where toUser matches (case-insensitive)
    const userRequests = await MeetingRequest.find({
      toUser: { $regex: new RegExp(`^${username}$`, "i") },
      status: "pending",
    });

    res.json(userRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/requests - send a match/meeting request to another user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { toUsername, date, time, location, message } = req.body;

    if (!toUsername || !date || !time || !location) {
      return res.status(400).json({
        error: "Missing required fields: toUsername, date, time, location",
      });
    }

    const fromUser = await User.findById(req.user.userId).select("username");
    const fromUsername = fromUser?.username || "unknown";

    const newRequest = await MeetingRequest.create({
      fromUser: fromUsername,
      toUser: toUsername,
      date,
      time,
      location,
      message: message || "",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Meeting request sent",
      data: newRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/requests/:id/approve - approve a meeting request
router.post("/:id/approve", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || "";

    const request = await MeetingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Create a confirmed study sync from the approved request
    const newSync = await StudySync.create({
      title: `Study with ${request.fromUser}`,
      datetime: new Date(`${request.date} ${request.time}`),
      location: request.location,
      message: request.message || "Confirmed study sync",
      members: [username, request.fromUser],
      maxMembers: 5,
      status: "active",
      createdBy: username,
    });

    // Mark request as approved
    request.status = "approved";
    await request.save();

    res.json({
      success: true,
      message: "Meeting request approved and sync created",
      data: newSync,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/requests/:id/reject - reject a meeting request
router.post("/:id/reject", authMiddleware, async (req, res) => {
  try {
    const request = await MeetingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({
      success: true,
      message: "Meeting request rejected",
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

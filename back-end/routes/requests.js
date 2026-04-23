const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const { getStudySyncs, setStudySyncs, getMeetingRequests, setMeetingRequests } = require("../data/sharedData");

// GET /api/requests - retrieve pending meeting requests sent TO the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || "";

    // Only return requests where toUser matches the logged-in user
    const allRequests = getMeetingRequests();
    const userRequests = allRequests.filter((r) => r.toUser === username);

    // Normalize: ensure each request has both id and _id for frontend compatibility
    const normalized = userRequests.map((r) => ({ ...r, _id: r._id || r.id }));

    res.json(normalized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/requests - send a match/meeting request to another user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { toUserId, toUsername, date, time, location } = req.body;

    if (!toUsername || !date || !time || !location) {
      return res.status(400).json({
        error: "Missing required fields: toUsername, date, time, location",
      });
    }

    const fromUser = await User.findById(req.user.userId).select("username");
    const fromUsername = fromUser?.username || "unknown";

    const meetingRequests = getMeetingRequests();
    const newRequest = {
      id: Math.max(...meetingRequests.map((r) => r.id), 0) + 1,
      fromUser: fromUsername,
      toUser: toUsername,
      date,
      time,
      location,
      status: "pending",
    };

    meetingRequests.push(newRequest);
    setMeetingRequests(meetingRequests);

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
    const requestId = parseInt(req.params.id);
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || "";

    const meetingRequests = getMeetingRequests();
    const requestIndex = meetingRequests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    const request = meetingRequests[requestIndex];
    const studySyncs = getStudySyncs();

    // Create a confirmed study sync from the approved request
    const newSync = {
      id: Math.max(...studySyncs.map((s) => s.id), 0) + 1,
      title: `Study with ${request.fromUser}`,
      datetime: `${request.date} ${request.time}`,
      location: request.location,
      message: "Confirmed study sync",
      members: [username, request.fromUser],
      maxMembers: 5,
      status: "active",
    };

    studySyncs.push(newSync);
    setStudySyncs(studySyncs);

    // Remove from pending
    meetingRequests.splice(requestIndex, 1);
    setMeetingRequests(meetingRequests);

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
    const requestId = parseInt(req.params.id);
    const meetingRequests = getMeetingRequests();
    const requestIndex = meetingRequests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    const rejectedRequest = meetingRequests[requestIndex];
    meetingRequests.splice(requestIndex, 1);
    setMeetingRequests(meetingRequests);

    res.json({
      success: true,
      message: "Meeting request rejected",
      data: rejectedRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

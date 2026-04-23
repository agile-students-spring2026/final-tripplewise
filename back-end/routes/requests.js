const express = require("express");
const router = express.Router();
const MeetingRequest = require("../models/MeetingRequest");
const StudySync = require("../models/StudySync");

// GET /api/requests - retrieve all pending meeting requests
router.get("/", async (req, res) => {
  try {
    const meetingRequests = await MeetingRequest.find({ status: "pending" });
    res.json({
      success: true,
      data: meetingRequests
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// POST /api/requests - create a new meeting request
router.post("/", async (req, res) => {
  const { toUserId, date, time, location, message, fromUser } = req.body;
  
  if (!toUserId || !date || !time || !location) {
    return res.status(400).json({ 
      error: "Missing required fields: toUserId, date, time, location" 
    });
  }
  
  try {
    const newRequest = new MeetingRequest({
      fromUser: fromUser || "CurrentUser",
      toUser: toUserId,
      date,
      time,
      location,
      message: message || "",
      status: "pending"
    });
    
    await newRequest.save();
    
    res.status(201).json({
      success: true,
      message: "Meeting request sent",
      data: newRequest
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

// POST /api/requests/:id/approve - approve a meeting request
router.post("/:id/approve", async (req, res) => {
  try {
    const request = await MeetingRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    
    // Create a new confirmed study sync from the approved request
    const newSync = new StudySync({
      title: `Study with ${request.fromUser}`,
      datetime: `${request.date} ${request.time}`,
      location: request.location,
      message: "Confirmed study sync",
      members: ["you", request.fromUser],
      maxMembers: 5,
      createdBy: request.toUser,
      status: "active"
    });
    
    await newSync.save();
    
    // Update request status to approved
    request.status = "approved";
    await request.save();
    
    res.json({
      success: true,
      message: "Meeting request approved and sync created",
      data: newSync
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve request" });
  }
});

// POST /api/requests/:id/reject - reject a meeting request
router.post("/:id/reject", async (req, res) => {
  try {
    const request = await MeetingRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    
    // Update request status to rejected
    request.status = "rejected";
    await request.save();
    
    res.json({
      success: true,
      message: "Meeting request rejected",
      data: request
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject request" });
  }
});

module.exports = router;

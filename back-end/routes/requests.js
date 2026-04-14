const express = require("express");
const router = express.Router();
const { getStudySyncs, setStudySyncs, getMeetingRequests, setMeetingRequests } = require("../data/sharedData");

// GET /api/requests - retrieve all pending meeting requests
router.get("/", (req, res) => {
  const meetingRequests = getMeetingRequests();
  res.json({
    success: true,
    data: meetingRequests
  });
});

// POST /api/requests - create a new meeting request
router.post("/", (req, res) => {
  const { toUserId, date, time, location } = req.body;
  
  if (!toUserId || !date || !time || !location) {
    return res.status(400).json({ 
      error: "Missing required fields: toUserId, date, time, location" 
    });
  }
  
  const meetingRequests = getMeetingRequests();
  const newRequest = {
    id: Math.max(...meetingRequests.map(r => r.id), 0) + 1,
    fromUser: "CurrentUser",
    date: date,
    time: time,
    location: location,
    status: "pending"
  };
  
  meetingRequests.push(newRequest);
  setMeetingRequests(meetingRequests);
  
  res.status(201).json({
    success: true,
    message: "Meeting request sent",
    data: newRequest
  });
});

// POST /api/requests/:id/approve - approve a meeting request
router.post("/:id/approve", (req, res) => {
  const requestId = parseInt(req.params.id);
  const meetingRequests = getMeetingRequests();
  const requestIndex = meetingRequests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  const request = meetingRequests[requestIndex];
  const studySyncs = getStudySyncs();
  
  // Create a new confirmed study sync from the approved request
  const newSync = {
    id: Math.max(...studySyncs.map(s => s.id), 0) + 1,
    title: `Study with ${request.fromUser}`,
    datetime: `${request.date} ${request.time}`,
    location: request.location,
    message: "Confirmed study sync",
    members: ["you", request.fromUser],
    maxMembers: 5,
    status: "active"
  };
  
  studySyncs.push(newSync);
  setStudySyncs(studySyncs);
  
  // Remove request from pending
  meetingRequests.splice(requestIndex, 1);
  setMeetingRequests(meetingRequests);
  
  res.json({
    success: true,
    message: "Meeting request approved and sync created",
    data: newSync
  });
});

// POST /api/requests/:id/reject - reject a meeting request
router.post("/:id/reject", (req, res) => {
  const requestId = parseInt(req.params.id);
  const meetingRequests = getMeetingRequests();
  const requestIndex = meetingRequests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  const rejectedRequest = meetingRequests[requestIndex];
  meetingRequests.splice(requestIndex, 1);
  setMeetingRequests(meetingRequests);
  
  res.json({
    success: true,
    message: "Meeting request rejected",
    data: rejectedRequest
  });
});

module.exports = router;

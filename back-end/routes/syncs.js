const express = require("express");
const router = express.Router();
const { getStudySyncs, setStudySyncs } = require("../data/sharedData");

// GET /api/syncs - retrieve all confirmed study syncs
router.get("/", (req, res) => {
  const studySyncs = getStudySyncs();
  res.json({
    success: true,
    data: studySyncs
  });
});

// POST /api/syncs - create a new study sync
router.post("/", (req, res) => {
  const { title, datetime, location, message, members, maxMembers } = req.body;
  
  if (!title || !datetime || !location) {
    return res.status(400).json({ 
      error: "Missing required fields: title, datetime, location" 
    });
  }
  
  const studySyncs = getStudySyncs();
  const newSync = {
    id: Math.max(...studySyncs.map(s => s.id), 0) + 1,
    title: title,
    datetime: datetime,
    location: location,
    message: message || "",
    members: Array.isArray(members) ? members : ["you"],
    maxMembers: maxMembers || 5,
    status: "active"
  };
  
  studySyncs.push(newSync);
  setStudySyncs(studySyncs);
  
  res.status(201).json({
    success: true,
    message: "Study sync created",
    data: newSync
  });
});

// POST /api/syncs/:id/join - add a member to a study sync
router.post("/:id/join", (req, res) => {
  const syncId = parseInt(req.params.id);
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }
  
  const studySyncs = getStudySyncs();
  const sync = studySyncs.find(s => s.id === syncId);
  
  if (!sync) {
    return res.status(404).json({ error: "Study sync not found" });
  }
  
  if (sync.members.includes(username)) {
    return res.status(400).json({ error: "User already in this sync" });
  }
  
  if (sync.members.length >= sync.maxMembers) {
    return res.status(400).json({ error: "Study sync is at capacity" });
  }
  
  sync.members.push(username);
  setStudySyncs(studySyncs);
  
  res.json({
    success: true,
    message: `${username} joined the study sync`,
    data: sync
  });
});

// POST /api/syncs/:id/leave - remove a member from a study sync
router.post("/:id/leave", (req, res) => {
  const syncId = parseInt(req.params.id);
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }
  
  const studySyncs = getStudySyncs();
  const sync = studySyncs.find(s => s.id === syncId);
  
  if (!sync) {
    return res.status(404).json({ error: "Study sync not found" });
  }
  
  if (!sync.members.includes(username)) {
    return res.status(400).json({ error: "User not in this sync" });
  }
  
  sync.members = sync.members.filter(m => m !== username);
  setStudySyncs(studySyncs);
  
  res.json({
    success: true,
    message: `${username} left the study sync`,
    data: sync
  });
});

// PUT /api/syncs/:id/status - update sync status (active/completed)
router.put("/:id/status", (req, res) => {
  const syncId = parseInt(req.params.id);
  const { status } = req.body;
  
  if (!["active", "completed"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'active' or 'completed'" });
  }
  
  const studySyncs = getStudySyncs();
  const sync = studySyncs.find(s => s.id === syncId);
  
  if (!sync) {
    return res.status(404).json({ error: "Study sync not found" });
  }
  
  sync.status = status;
  setStudySyncs(studySyncs);
  
  res.json({
    success: true,
    message: `Study sync status updated to ${status}`,
    data: sync
  });
});

module.exports = router;

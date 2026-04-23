const express = require("express");
const router = express.Router();
const StudySync = require("../models/StudySync");

// GET /api/syncs - retrieve all confirmed study syncs
router.get("/", async (req, res) => {
  try {
    const studySyncs = await StudySync.find().sort({ datetime: 1 });
    res.json({
      success: true,
      data: studySyncs
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch syncs" });
  }
});

// POST /api/syncs - create a new study sync
router.post("/", async (req, res) => {
  const { title, datetime, location, message, members, maxMembers, createdBy } = req.body;
  
  if (!title || !datetime || !location) {
    return res.status(400).json({ 
      error: "Missing required fields: title, datetime, location" 
    });
  }
  
  try {
    const newSync = new StudySync({
      title,
      datetime,
      location,
      message: message || "",
      members: Array.isArray(members) ? members : ["you"],
      maxMembers: maxMembers || 5,
      createdBy: createdBy || "system",
      status: "active"
    });
    
    await newSync.save();
    
    res.status(201).json({
      success: true,
      message: "Study sync created",
      data: newSync
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create sync" });
  }
});

// POST /api/syncs/:id/join - add a member to a study sync
router.post("/:id/join", async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }
  
  try {
    const sync = await StudySync.findById(req.params.id);
    
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
    await sync.save();
    
    res.json({
      success: true,
      message: `${username} joined the study sync`,
      data: sync
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to join sync" });
  }
});

// POST /api/syncs/:id/leave - remove a member from a study sync
router.post("/:id/leave", async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }
  
  try {
    const sync = await StudySync.findById(req.params.id);
    
    if (!sync) {
      return res.status(404).json({ error: "Study sync not found" });
    }
    
    if (!sync.members.includes(username)) {
      return res.status(400).json({ error: "User not in this sync" });
    }
    
    sync.members = sync.members.filter(m => m !== username);
    await sync.save();
    
    res.json({
      success: true,
      message: `${username} left the study sync`,
      data: sync
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to leave sync" });
  }
});

// PUT /api/syncs/:id/status - update sync status (active/completed/cancelled)
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  
  if (!["active", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Status must be 'active', 'completed', or 'cancelled'" });
  }
  
  try {
    const sync = await StudySync.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!sync) {
      return res.status(404).json({ error: "Study sync not found" });
    }
    
    res.json({
      success: true,
      message: `Study sync status updated to ${status}`,
      data: sync
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update sync status" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const { getStudySyncs, setStudySyncs } = require("../data/sharedData");

// GET /api/syncs - retrieve study syncs for the logged-in user only
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Get the logged-in user's username to filter syncs
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || "";

    // Only return syncs where this user is a member
    const allSyncs = getStudySyncs();
    const userSyncs = allSyncs.filter(
      (s) => Array.isArray(s.members) && s.members.includes(username)
    );

    res.json(userSyncs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/syncs - create a new study sync (logged-in user is automatically a member)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, datetime, location, message, maxMembers } = req.body;

    if (!title || !datetime || !location) {
      return res.status(400).json({
        error: "Missing required fields: title, datetime, location",
      });
    }

    // Get the logged-in user's username
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || "you";

    const studySyncs = getStudySyncs();
    const newSync = {
      id: Math.max(...studySyncs.map((s) => s.id), 0) + 1,
      title,
      datetime,
      location,
      message: message || "",
      members: [username],
      maxMembers: maxMembers || 5,
      status: "active",
    };

    studySyncs.push(newSync);
    setStudySyncs(studySyncs);

    res.status(201).json({
      success: true,
      message: "Study sync created",
      data: newSync,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/syncs/:id/join - add a member to a study sync
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const syncId = parseInt(req.params.id);
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || req.body.username;

    const studySyncs = getStudySyncs();
    const sync = studySyncs.find((s) => s.id === syncId);

    if (!sync) return res.status(404).json({ error: "Study sync not found" });
    if (sync.members.includes(username))
      return res.status(400).json({ error: "User already in this sync" });
    if (sync.members.length >= sync.maxMembers)
      return res.status(400).json({ error: "Study sync is at capacity" });

    sync.members.push(username);
    setStudySyncs(studySyncs);

    res.json({ success: true, message: `${username} joined the study sync`, data: sync });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/syncs/:id/leave - remove a member from a study sync
router.post("/:id/leave", authMiddleware, async (req, res) => {
  try {
    const syncId = parseInt(req.params.id);
    const user = await User.findById(req.user.userId).select("username");
    const username = user?.username || req.body.username;

    const studySyncs = getStudySyncs();
    const sync = studySyncs.find((s) => s.id === syncId);

    if (!sync) return res.status(404).json({ error: "Study sync not found" });
    if (!sync.members.includes(username))
      return res.status(400).json({ error: "User not in this sync" });

    sync.members = sync.members.filter((m) => m !== username);
    setStudySyncs(studySyncs);

    res.json({ success: true, message: `${username} left the study sync`, data: sync });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/syncs/:id/status - update sync status (active/completed)
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const syncId = parseInt(req.params.id);
    const { status } = req.body;

    if (!["active", "completed"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'active' or 'completed'" });
    }

    const studySyncs = getStudySyncs();
    const sync = studySyncs.find((s) => s.id === syncId);

    if (!sync) return res.status(404).json({ error: "Study sync not found" });

    sync.status = status;
    setStudySyncs(studySyncs);

    res.json({ success: true, message: `Study sync status updated to ${status}`, data: sync });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

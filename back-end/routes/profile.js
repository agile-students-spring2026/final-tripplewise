const express = require("express");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Mock profiles store (replace with MongoDB later)
let profiles = {};

// GET /api/profile — protected, returns current user's profile
router.get("/", authMiddleware, (req, res) => {
  const userId = req.user.id;
  const profile = profiles[userId] || {
    id: userId,
    username: req.user.username,
    bio: "",
    classes: [],
    locations: [],
    methods: [],
  };
  res.json({ success: true, data: profile });
});

// PUT /api/profile — protected, update profile
router.put(
  "/",
  authMiddleware,
  [
    body("bio").trim().optional(),
    body("classes").isArray().optional(),
    body("locations").isArray().optional(),
    body("methods").isArray().optional(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userId = req.user.id;
    const { bio, classes, locations, methods } = req.body;

    profiles[userId] = {
      id: userId,
      username: req.user.username,
      bio: bio || "",
      classes: classes || [],
      locations: locations || [],
      methods: methods || [],
    };

    res.json({ success: true, data: profiles[userId] });
  }
);

module.exports = router;
const express = require("express");
const router = express.Router();
const { calculateMatchPercentage } = require("../utils/matchingEngine");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /api/matches - retrieve all matches for the logged-in user
// Uses matchingEngine to calculate compatibility between current user and all other users in DB
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Get the logged-in user's full profile
    const currentUser = await User.findById(req.user.userId).select("-password");
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Get all other users from the database
    const candidates = await User.find({ _id: { $ne: req.user.userId } }).select("-password");

    // Calculate match percentages
    const matches = candidates.map((candidate) => {
      const matchPercentage = calculateMatchPercentage(
        currentUser.toObject(),
        candidate.toObject()
      );
      return {
        id: candidate._id,
        username: candidate.username,
        firstName: candidate.firstName || "",
        lastName: candidate.lastName || "",
        major: candidate.major || "",
        year: candidate.year || "",
        preferredLocations: candidate.preferredLocations || [],
        preferredMethods: candidate.preferredMethods || [],
        matchPercentage,
      };
    });

    // Sort by match percentage descending by default
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({
      success: true,
      data: matches,
    });
  } catch (err) {
    console.error("Matches error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/matches/:id - get a specific match profile with calculated compatibility
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId).select("-password");
    const candidate = await User.findById(req.params.id).select("-password");

    if (!candidate) {
      return res.status(404).json({ error: "Match not found" });
    }

    const matchPercentage = calculateMatchPercentage(
      currentUser.toObject(),
      candidate.toObject()
    );

    res.json({
      success: true,
      data: {
        id: candidate._id,
        username: candidate.username,
        firstName: candidate.firstName || "",
        lastName: candidate.lastName || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        major: candidate.major || "",
        year: candidate.year || "",
        bio: candidate.bio || "",
        matchPercentage,
        schedule: candidate.schedule || [],
        preferredLocations: candidate.preferredLocations || [],
        preferredMethods: candidate.preferredMethods || [],
      },
    });
  } catch (err) {
    console.error("Match profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

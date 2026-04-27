const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const syncsRoutes = require("./routes/syncs");
const requestsRoutes = require("./routes/requests");
const matchesRoutes = require("./routes/matches");
const { getCurrentUser, setCurrentUser } = require("./data/mockData");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Study Sync backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working"
  });
});

// ===== ROUTE IMPORTS =====
app.use("/api/auth", authRoutes);
app.use("/api/syncs", syncsRoutes);
app.use("/api/requests", requestsRoutes);
app.use("/api/matches", matchesRoutes);

// ===== PROFILE ENDPOINTS =====

const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");

// GET /api/users/me  – return the logged-in user's full profile
app.get("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/users/me  – update basic account details
app.patch("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const { username, firstName, lastName, email, phone, major, year, bio } = req.body || {};

    const updates = {};
    if (username !== undefined) updates.username = username;
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (major !== undefined) updates.major = major;
    if (year !== undefined) updates.year = year;
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/me/schedule  – replace the user's schedule
app.put("/api/users/me/schedule", authMiddleware, async (req, res) => {
  try {
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Expected an array of schedule items" });
    }

    const schedule = payload.map((c, i) => ({
      id:   c.id ?? Date.now() + i,
      name: c.name ?? "",
      day:  c.day  ?? "",
      time: c.time ?? "09:00",
    }));

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { schedule },
      { new: true }
    );

    res.json({ success: true, schedule: user.schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/me/locations  – replace the user's preferred locations
app.put("/api/users/me/locations", authMiddleware, async (req, res) => {
  try {
    const { locations } = req.body;

    if (!Array.isArray(locations)) {
      return res.status(400).json({ error: "Expected { locations: [] }" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { preferredLocations: locations },
      { new: true }
    );

    res.json({ success: true, preferredLocations: user.preferredLocations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/me/password  – change the user's password
app.put("/api/users/me/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const bcrypt = require("bcryptjs");
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.userId, { password: hashed });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/users/me  – permanently delete the logged-in user's account
app.delete("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/me/methods  – replace the user's preferred study methods
app.put("/api/users/me/methods", authMiddleware, async (req, res) => {
  try {
    const { methods } = req.body;

    if (!Array.isArray(methods)) {
      return res.status(400).json({ error: "Expected { methods: [] }" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { preferredMethods: methods },
      { new: true }
    );

    res.json({ success: true, preferredMethods: user.preferredMethods });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== START SERVER =====
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
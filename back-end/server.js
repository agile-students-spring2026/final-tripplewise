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

// GET /api/users/me  – return the logged-in user's full profile
app.get("/api/users/me", (req, res) => {
  const user = getCurrentUser();
  res.json(user);
});

// PATCH /api/users/me  – update basic account details
app.patch("/api/users/me", (req, res) => {
  const { username, firstName, lastName, email, phone, major, year, bio } = req.body || {};
  const user = getCurrentUser();
  const updated = {
    ...user,
    ...(username !== undefined && { username }),
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(email !== undefined && { email }),
    ...(phone !== undefined && { phone }),
    ...(major !== undefined && { major }),
    ...(year !== undefined && { year }),
    ...(bio !== undefined && { bio }),
  };
  setCurrentUser(updated);
  res.json({ success: true, user: updated });
});

// PUT /api/users/me/schedule  – replace the user's schedule
app.put("/api/users/me/schedule", (req, res) => {
  const payload = req.body;
  if (!Array.isArray(payload)) {
    return res.status(400).json({ error: "Expected an array of schedule items" });
  }
  const user = getCurrentUser();
  const schedule = payload.map((c, i) => ({
    id: c.id ?? Date.now() + i,
    name: c.name ?? "",
    time: c.time ?? "09:00",
  }));
  setCurrentUser({ ...user, schedule });
  res.json({ success: true, schedule });
});

// PUT /api/users/me/locations  – replace the user's preferred locations
app.put("/api/users/me/locations", (req, res) => {
  const { locations } = req.body || {};
  if (!Array.isArray(locations)) {
    return res.status(400).json({ error: "Expected { locations: [] }" });
  }
  const user = getCurrentUser();
  setCurrentUser({ ...user, preferredLocations: locations });
  res.json({ success: true, preferredLocations: locations });
});

// PUT /api/users/me/methods  – replace the user's preferred study methods
app.put("/api/users/me/methods", (req, res) => {
  const { methods } = req.body || {};
  if (!Array.isArray(methods)) {
    return res.status(400).json({ error: "Expected { methods: [] }" });
  }
  const user = getCurrentUser();
  setCurrentUser({ ...user, preferredMethods: methods });
  res.json({ success: true, preferredMethods: methods });
});

// ===== START SERVER =====
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
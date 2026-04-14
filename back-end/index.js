const express = require("express");
const cors = require("cors");
const path = require("path");
const matchesRouter = require("./routes/matches");
const requestsRouter = require("./routes/requests");
const syncsRouter = require("./routes/syncs");
const authRouter = require("./routes/auth");
const app = express();
app.use(cors());
app.use(express.json());

// mount routers
app.use("/api/matches", matchesRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/syncs", syncsRouter);
app.use("/api/auth", authRouter);

// In-memory mock data
let schedules = [
  { id: 1, name: "CS101 Lecture", time: "09:00" },
  { id: 2, name: "Math 201", time: "11:30" },
];

let profiles = [
  {
    id: 1,
    username: "John_Doe",
    bio: "CS student",
    classes: ["Operating Systems", "Algorithms"],
    locations: ["Bobst LL2", "Washington Square Park"],
    methods: ["In-Person"],
  },
  {
    id: 2,
    username: "Sarah_Smith",
    bio: "Math major",
    classes: ["Calculus"],
    locations: ["NYU Library"],
    methods: ["Virtual"],
  },
];

const matches = [
  {
    id: 101,
    username: "John_Doe",
    location: "Bobst LL2",
    method: "In-Person",
    matchPercentage: 92,
    bio: "CS student who likes OS",
  },
  {
    id: 102,
    username: "Sarah_Smith",
    location: "NYU Library",
    method: "Virtual",
    matchPercentage: 87,
    bio: "Math major interested in study groups",
  },
  {
    id: 103,
    username: "Emma_Wilson",
    location: "Bobst LL2",
    method: "Hybrid",
    matchPercentage: 85,
    bio: "Grad student, evenings only",
  },
];

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// Profiles
app.get("/api/profiles", (req, res) => res.json(profiles));
app.get("/api/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = profiles.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: "Profile not found" });
  res.json(p);
});

// Schedule
app.get("/api/schedule", (req, res) => res.json(schedules));
app.post("/api/schedule", (req, res) => {
  const payload = req.body;
  if (!Array.isArray(payload)) return res.status(400).json({ error: "Expected array" });
  schedules = payload.map((c, i) => ({ id: c.id ?? Date.now() + i, name: c.name ?? "", time: c.time ?? "09:00" }));
  res.json({ success: true, schedule: schedules });
});

// Serve static if you build frontend into backend/public
const publicPath = path.join(process.cwd(), "back-end", "public");
app.use(express.static(publicPath));
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    const index = path.join(publicPath, "index.html");
    return res.sendFile(index, (err) => {
      if (err) res.status(404).send("Not found");
    });
  }
  res.json({ ok: true });
});

// only listen when not testing
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

module.exports = app;

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let studySyncs = [
  {
    id: 1,
    title: "OS Study Group",
    datetime: new Date(Date.now() + 86400000).toISOString(),
    location: "Bobst Library",
    message: "Let's focus on chapter 4.",
  },
  {
    id: 2,
    title: "Algorithms Review",
    datetime: new Date(Date.now() - 172800000).toISOString(),
    location: "Campus Cafe",
    message: "Recap sorting algorithms.",
  },
];

let schedules = [
  { id: 1, name: "CS101 Lecture", time: "09:00" },
  { id: 2, name: "Math 201", time: "11:30" },
];

let profiles = [
  {
    id: 1,
    username: "You",
    bio: "Mock user",
    classes: ["Operating Systems", "Algorithms"],
    locations: ["Bobst LL2"],
    methods: ["In-Person"],
  },
  {
    id: 2,
    username: "John_Doe",
    bio: "CS student",
    classes: ["OS"],
    locations: ["Bobst LL2"],
    methods: ["In-Person"],
  },
];
app.get("/", (req, res) => {
  res.send("Study Sync backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working"
  });
});
/* Study syncs */
app.get("/api/syncs", (req, res) => {
  res.json(studySyncs);
});
app.post("/api/syncs", (req, res) => {
  const { title, datetime, location, message } = req.body || {};
  if (!title || !datetime || !location) return res.status(400).json({ error: "Missing fields" });
  const newSync = { id: Date.now(), title, datetime, location, message: message || "" };
  studySyncs.unshift(newSync);
  res.status(201).json(newSync);
});

/* Schedule */
app.get("/api/schedule", (req, res) => {
  res.json(schedules);
});
app.post("/api/schedule", (req, res) => {
  const payload = req.body;
  if (!Array.isArray(payload)) return res.status(400).json({ error: "Expected array" });
  schedules = payload.map((c, i) => ({ id: c.id ?? Date.now() + i, name: c.name ?? "", time: c.time ?? "09:00" }));
  res.json({ success: true, schedule: schedules });
});

/* Profiles */
app.get("/api/profiles", (req, res) => {
  res.json(profiles);
});
app.get("/api/profile/:id", (req, res) => {
  const id = Number(req.params.id);
  const p = profiles.find((x) => x.id === id);
  if (!p) return res.status(404).json({ error: "Profile not found" });
  res.json(p);
});

// placeholder route structure (for teammates)
app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
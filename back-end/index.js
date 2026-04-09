import express from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

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

// Study syncs
app.get("/api/syncs", (req, res) => res.json(studySyncs));
app.post("/api/syncs", (req, res) => {
  const { title, datetime, location, message } = req.body || {};
  if (!title || !datetime || !location) return res.status(400).json({ error: "Missing required fields" });
  const newSync = { id: Date.now(), title, datetime, location, message: message || "" };
  studySyncs.unshift(newSync);
  res.status(201).json(newSync);
});

// Serve static if you build frontend into backend/public
const publicPath = path.join(process.cwd(), "backend", "public");
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

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
}
// GET all matches
app.get("/api/matches", (req, res) => {
  // optional: allow simple filtering via query (e.g. ?location=Bobst)
  const { location, method } = req.query;
  let out = matches;
  if (location) out = out.filter((m) => m.location === location);
  if (method) out = out.filter((m) => m.method === method);
  res.json(out);
});

// GET match by id
app.get("/api/matches/:id", (req, res) => {
  const id = Number(req.params.id);
  const m = matches.find((x) => x.id === id);
  if (!m) return res.status(404).json({ error: "Match not found" });
  res.json(m);
});

export default app;
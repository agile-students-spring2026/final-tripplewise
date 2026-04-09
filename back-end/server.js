const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const { getCurrentUser, setCurrentUser } = require("./data/mockData");

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

app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

app.get("/api/matches", (req, res) => {
  const matches = studySyncs.map((s) => ({
    id: s.id,
    username: s.title.split(" ")[0] || `user${s.id}`,
    location: s.location,
    method: "Mixed",
    matchPercentage: Math.floor(Math.random() * 30) + 70,
  }));
  res.json(matches);
});

app.get("/api/matches/:id", (req, res) => {
  const id = Number(req.params.id);
  const match = studySyncs.find((s) => s.id === id);
  if (!match) return res.status(404).json({ error: "Match not found" });
  res.json({
    id: match.id,
    username: match.title,
    location: match.location,
    method: "In-Person",
    bio: match.message || "",
    matchPercentage: Math.floor(Math.random() * 30) + 70,
  });
});

/* ── Current-user profile endpoints ── */

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
    ...(username  !== undefined && { username  }),
    ...(firstName !== undefined && { firstName }),
    ...(lastName  !== undefined && { lastName  }),
    ...(email     !== undefined && { email     }),
    ...(phone     !== undefined && { phone     }),
    ...(major     !== undefined && { major     }),
    ...(year      !== undefined && { year      }),
    ...(bio       !== undefined && { bio       }),
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
    id:   c.id   ?? Date.now() + i,
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

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

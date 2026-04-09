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

// ===== STUDY SYNC SCHEDULING ROUTES =====

// GET /api/syncs – retrieve all confirmed study syncs (for dashboard upcoming syncs tab)
app.get("/api/syncs", (req, res) => {
  res.json({
    success: true,
    data: studySyncs
  });
});

// GET /api/requests – retrieve all pending meeting requests (for dashboard meeting requests tab)
let meetingRequests = [
  {
    id: 1,
    fromUser: "Sarah_Smith",
    date: "1/1/2026",
    time: "12:30 PM",
    location: "Bobst LL2",
    status: "pending"
  },
  {
    id: 2,
    fromUser: "Mike_Johnson",
    date: "1/2/2026",
    time: "2:00 PM",
    location: "NYU Library",
    status: "pending"
  }
];

app.get("/api/requests", (req, res) => {
  res.json({
    success: true,
    data: meetingRequests
  });
});

// POST /api/requests – create a new meeting request (user sends request to another user)
app.post("/api/requests", (req, res) => {
  const { toUserId, date, time, location } = req.body;
  
  if (!toUserId || !date || !time || !location) {
    return res.status(400).json({ error: "Missing required fields: toUserId, date, time, location" });
  }
  
  const newRequest = {
    id: Math.max(...meetingRequests.map(r => r.id), 0) + 1,
    fromUser: "CurrentUser", // In real app, get from auth token
    date: date,
    time: time,
    location: location,
    status: "pending"
  };
  
  meetingRequests.push(newRequest);
  
  res.status(201).json({
    success: true,
    message: "Meeting request sent",
    data: newRequest
  });
});

// POST /api/requests/:id/approve – approve a pending meeting request (moves to confirmed syncs)
app.post("/api/requests/:id/approve", (req, res) => {
  const requestId = parseInt(req.params.id);
  const requestIndex = meetingRequests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  const request = meetingRequests[requestIndex];
  
  // Create a new confirmed study sync from the approved request
  const newSync = {
    id: Math.max(...studySyncs.map(s => s.id), 0) + 1,
    title: `Study with ${request.fromUser}`,
    datetime: `${request.date} ${request.time}`,
    location: request.location,
    message: "Confirmed study sync"
  };
  
  studySyncs.push(newSync);
  
  // Remove request from pending
  meetingRequests.splice(requestIndex, 1);
  
  res.json({
    success: true,
    message: "Meeting request approved and sync created",
    data: newSync
  });
});

// POST /api/requests/:id/reject – reject a pending meeting request (removes from requests)
app.post("/api/requests/:id/reject", (req, res) => {
  const requestId = parseInt(req.params.id);
  const requestIndex = meetingRequests.findIndex(r => r.id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Request not found" });
  }
  
  const rejectedRequest = meetingRequests[requestIndex];
  meetingRequests.splice(requestIndex, 1);
  
  res.json({
    success: true,
    message: "Meeting request rejected",
    data: rejectedRequest
  });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

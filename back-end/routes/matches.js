const express = require("express");
const router = express.Router();

let matches = [
  {
    id: 1,
    username: "John_Doe",
    location: "Bobst LL2",
    method: "In-Person",
    matchPercentage: 92
  },
  {
    id: 2,
    username: "Sarah_Smith",
    location: "NYU Library",
    method: "Virtual",
    matchPercentage: 87
  },
  {
    id: 3,
    username: "Mike_Johnson",
    location: "Coffee Shop",
    method: "In-Person",
    matchPercentage: 78
  },
  {
    id: 4,
    username: "Emma_Wilson",
    location: "Bobst LL2",
    method: "Hybrid",
    matchPercentage: 85
  }
];

// GET /api/matches - retrieve all matches with optional filtering and sorting
router.get("/", (req, res) => {
  const { filter, sort } = req.query;
  
  let filtered = [...matches];
  
  // Apply filter if provided
  if (filter === "location") {
    filtered = filtered.filter(m => m.location === "Bobst LL2");
  } else if (filter === "method") {
    filtered = filtered.filter(m => m.method === "In-Person");
  }
  
  // Apply sort if provided
  if (sort === "match") {
    filtered.sort((a, b) => b.matchPercentage - a.matchPercentage);
  } else if (sort === "name") {
    filtered.sort((a, b) => a.username.localeCompare(b.username));
  }
  
  res.json({
    success: true,
    data: filtered
  });
});

// GET /api/matches/:id - get a specific match profile
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const match = matches.find(m => m.id === id);
  
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }
  
  res.json({
    success: true,
    data: {
      id: match.id,
      username: match.username,
      email: `${match.username.toLowerCase()}@example.com`,
      location: match.location,
      method: match.method,
      matchPercentage: match.matchPercentage,
      bio: "Looking to study together",
      subjects: ["Math", "Physics"],
      availableTimes: ["12:00 PM", "2:00 PM", "4:00 PM"]
    }
  });
});

module.exports = router;

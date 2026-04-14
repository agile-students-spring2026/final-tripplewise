const express = require("express");
const router = express.Router();
const { calculateMatchPercentage } = require("../utils/matchingEngine");
const { getCurrentUser } = require("../data/mockData");

// Mock database of candidate profiles
// In future: replace with real database queries
let candidateUsers = [
  {
    id: 2,
    username: "alex_chen",
    password: "password456",
    firstName: "Alex",
    lastName: "Chen",
    email: "alex.chen@nyu.edu",
    phone: "(234) 567-8901",
    major: "Computer Science",
    year: "Junior",
    bio: "Looking for study partners in OS and Algorithms",
    schedule: [
      { id: 1, name: "Operating Systems", time: "Monday 2:00 PM" },
      { id: 2, name: "Data Structures", time: "Wednesday 4:00 PM" }
    ],
    preferredLocations: ["Bobst Library", "Kimmel Commuter Lounge"],
    preferredMethods: ["Group Study", "Practice Problems"]
  },
  {
    id: 3,
    username: "jordan_lee",
    password: "password789",
    firstName: "Jordan",
    lastName: "Lee",
    email: "jordan.lee@nyu.edu",
    phone: "(345) 678-9012",
    major: "Computer Science",
    year: "Senior",
    bio: "Experienced CS student willing to help others",
    schedule: [
      { id: 1, name: "Basic Algorithms", time: "Wednesday 4:00 PM" },
      { id: 2, name: "Data Structures", time: "Tuesday 3:00 PM" }
    ],
    preferredLocations: ["Bobst Library", "NYU Library"],
    preferredMethods: ["Group Study", "Tutoring"]
  },
  {
    id: 4,
    username: "priya_patel",
    password: "password101",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya.patel@nyu.edu",
    phone: "(456) 789-0123",
    major: "Computer Science",
    year: "Sophomore",
    bio: "New to CS, looking for study buddies",
    schedule: [
      { id: 1, name: "Operating Systems", time: "Monday 2:00 PM" },
      { id: 2, name: "Introduction to Computing", time: "Thursday 1:00 PM" }
    ],
    preferredLocations: ["Kimmel Commuter Lounge", "Bobst Library"],
    preferredMethods: ["Group Study", "Practice Problems"]
  },
  {
    id: 5,
    username: "marco_rossi",
    password: "password202",
    firstName: "Marco",
    lastName: "Rossi",
    email: "marco.rossi@nyu.edu",
    phone: "(567) 890-1234",
    major: "Mathematics",
    year: "Junior",
    bio: "Math major interested in algorithms",
    schedule: [
      { id: 1, name: "Basic Algorithms", time: "Wednesday 4:00 PM" },
      { id: 2, name: "Linear Algebra", time: "Friday 2:00 PM" }
    ],
    preferredLocations: ["Bobst Library"],
    preferredMethods: ["Online Discussion", "Problem Solving"]
  }
];

// GET /api/matches - retrieve all matches with optional filtering and sorting
// Uses matchingEngine to calculate compatibility between current user and candidates
router.get("/", (req, res) => {
  const { filter, sort } = req.query;
  
  // Get current user from mock data (will be replaced with DB query)
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return res.status(400).json({ error: "Current user not found" });
  }
  
  // Calculate match percentages dynamically for all candidates
  // Database-ready: can swap candidateUsers with DB query
  let filtered = candidateUsers.map(candidate => {
    const matchPercentage = calculateMatchPercentage(currentUser, candidate);
    return {
      id: candidate.id,
      username: candidate.username,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      major: candidate.major,
      year: candidate.year,
      matchPercentage
    };
  });
  
  // Apply filter if provided (filter by preferred locations)
  if (filter === "location") {
    filtered = filtered.filter(m => {
      const candidate = candidateUsers.find(c => c.id === m.id);
      return candidate?.preferredLocations?.includes("Bobst Library");
    });
  } else if (filter === "method") {
    filtered = filtered.filter(m => {
      const candidate = candidateUsers.find(c => c.id === m.id);
      return candidate?.preferredMethods?.includes("Group Study");
    });
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

// GET /api/matches/:id - get a specific match profile with calculated compatibility
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const candidate = candidateUsers.find(u => u.id === id);
  
  if (!candidate) {
    return res.status(404).json({ error: "Match not found" });
  }
  
  // Get current user and calculate match percentage
  const currentUser = getCurrentUser();
  const matchPercentage = calculateMatchPercentage(currentUser, candidate);
  
  res.json({
    success: true,
    data: {
      id: candidate.id,
      username: candidate.username,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,
      phone: candidate.phone,
      major: candidate.major,
      year: candidate.year,
      bio: candidate.bio,
      matchPercentage,
      schedule: candidate.schedule,
      preferredLocations: candidate.preferredLocations,
      preferredMethods: candidate.preferredMethods
    }
  });
});

module.exports = router;

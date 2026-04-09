const express = require("express");
const router = express.Router();
const { getCurrentUser, setCurrentUser } = require("../data/mockData");

// POST /api/auth/signup
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  const updatedUser = {
    ...getCurrentUser(),
    username,
    password
  };

  setCurrentUser(updatedUser);

  res.status(201).json({
    success: true,
    message: "Signup successful",
    user: {
      id: updatedUser.id,
      username: updatedUser.username
    }
  });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const currentUser = getCurrentUser();

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  if (
    username !== currentUser.username ||
    password !== currentUser.password
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    user: {
      id: currentUser.id,
      username: currentUser.username,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email
    }
  });
});

module.exports = router;
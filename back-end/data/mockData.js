let currentUser = {
  id: 1,
  username: "student123",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@nyu.edu",
  phone: "(123) 456-7890",
  major: "Computer Science",
  year: "Junior",
  bio: "Student looking for study partners for CS courses.",

  schedule: [
    { id: 1, name: "Operating Systems", time: "Monday 2:00 PM" },
    { id: 2, name: "Basic Algorithms", time: "Wednesday 4:00 PM" }
  ],

  preferredLocations: [
    "Bobst Library",
    "Kimmel Commuter Lounge"
  ],

  preferredMethods: [
    "Group Study",
    "Practice Problems"
  ]
};

function getCurrentUser() {
  return currentUser;
}

function setCurrentUser(newUser) {
  currentUser = newUser;
}

module.exports = {
  getCurrentUser,
  setCurrentUser
};
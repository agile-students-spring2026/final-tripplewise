require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const email = "johndoe@nyu.edu";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists, skipping seed");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await User.create({
      username: "student123",
      password: hashedPassword,
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
    });

    console.log("Seeded user:", user.email);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedUser();
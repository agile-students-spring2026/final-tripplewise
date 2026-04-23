const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing users (optional - comment out to preserve data)
    // await User.deleteMany({});
    
    const users = [
      {
        username: "alex_chen",
        password: "password456",
        email: "alex.chen@nyu.edu",
        firstName: "Alex",
        lastName: "Chen",
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
        username: "jordan_lee",
        password: "password789",
        email: "jordan.lee@nyu.edu",
        firstName: "Jordan",
        lastName: "Lee",
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
        username: "priya_patel",
        password: "password101",
        email: "priya.patel@nyu.edu",
        firstName: "Priya",
        lastName: "Patel",
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
        username: "marco_rossi",
        password: "password202",
        email: "marco.rossi@nyu.edu",
        firstName: "Marco",
        lastName: "Rossi",
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
      },
      {
        username: "sarah_smith",
        password: "password303",
        email: "sarah.smith@nyu.edu",
        firstName: "Sarah",
        lastName: "Smith",
        phone: "(678) 901-2345",
        major: "Data Science",
        year: "Senior",
        bio: "Interested in machine learning study groups",
        schedule: [
          { id: 1, name: "Machine Learning", time: "Tuesday 3:00 PM" },
          { id: 2, name: "Statistics", time: "Thursday 2:00 PM" }
        ],
        preferredLocations: ["Bobst Library", "Brown Building"],
        preferredMethods: ["Virtual", "Group Study"]
      }
    ];
    
    // Check which users already exist
    const existingUsers = await User.find({
      username: { $in: users.map(u => u.username) }
    });
    
    const existingUsernames = new Set(existingUsers.map(u => u.username));
    
    // Only insert users that don't exist
    const usersToInsert = users.filter(u => !existingUsernames.has(u.username));
    
    if (usersToInsert.length > 0) {
      const result = await User.insertMany(usersToInsert);
      console.log(`✓ Seeded ${result.length} users successfully`);
      result.forEach(user => {
        console.log(`  - ${user.username} (${user.email})`);
      });
    } else {
      console.log("✓ All users already exist in database");
    }
    
    // Verify seed data
    const totalUsers = await User.countDocuments();
    console.log(`\nTotal users in database: ${totalUsers}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedUsers();

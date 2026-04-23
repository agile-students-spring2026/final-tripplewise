const mongoose = require("mongoose");
const StudySync = require("../models/StudySync");
const MeetingRequest = require("../models/MeetingRequest");
const connectDB = require("../config/db");

const seedData = async () => {
  try {
    await connectDB();
    
    // Seed Study Syncs
    const syncs = [
      {
        title: "OS Study Group",
        datetime: new Date(Date.now() + 86400000),
        location: "Bobst Library LL2",
        message: "Let's focus on chapter 4 and memory management",
        members: ["alex_chen", "priya_patel"],
        maxMembers: 5,
        createdBy: "alex_chen",
        status: "active"
      },
      {
        title: "Algorithms Review Session",
        datetime: new Date(Date.now() + 172800000),
        location: "Kimmel Commuter Lounge",
        message: "Recap sorting algorithms and complexity analysis",
        members: ["jordan_lee", "marco_rossi"],
        maxMembers: 6,
        createdBy: "jordan_lee",
        status: "active"
      },
      {
        title: "Data Structures Workshop",
        datetime: new Date(Date.now() + 259200000),
        location: "NYU Library",
        message: "Hands-on practice with linked lists and trees",
        members: ["alex_chen"],
        maxMembers: 4,
        createdBy: "alex_chen",
        status: "active"
      }
    ];
    
    const existingSyncs = await StudySync.find({
      title: { $in: syncs.map(s => s.title) }
    });
    
    const existingSyncTitles = new Set(existingSyncs.map(s => s.title));
    const syncsToInsert = syncs.filter(s => !existingSyncTitles.has(s.title));
    
    if (syncsToInsert.length > 0) {
      const result = await StudySync.insertMany(syncsToInsert);
      console.log(`✓ Seeded ${result.length} study syncs successfully`);
      result.forEach(sync => {
        console.log(`  - ${sync.title} (${sync.members.length} members)`);
      });
    } else {
      console.log("✓ All study syncs already exist in database");
    }
    
    // Seed Meeting Requests
    const requests = [
      {
        fromUser: "sarah_smith",
        toUser: "alex_chen",
        date: "4/25/2026",
        time: "3:00 PM",
        location: "Bobst Library",
        message: "Want to study machine learning together?",
        status: "pending"
      },
      {
        fromUser: "priya_patel",
        toUser: "jordan_lee",
        date: "4/26/2026",
        time: "4:30 PM",
        location: "Kimmel Commuter Lounge",
        message: "Could use some help with algorithms",
        status: "pending"
      },
      {
        fromUser: "marco_rossi",
        toUser: "alex_chen",
        date: "4/24/2026",
        time: "2:00 PM",
        location: "NYU Library",
        message: "Let's work on data structures problems",
        status: "pending"
      }
    ];
    
    const existingRequests = await MeetingRequest.find({
      fromUser: { $in: requests.map(r => r.fromUser) },
      toUser: { $in: requests.map(r => r.toUser) }
    });
    
    const existingRequestKeys = new Set(
      existingRequests.map(r => `${r.fromUser}-${r.toUser}`)
    );
    
    const requestsToInsert = requests.filter(r => 
      !existingRequestKeys.has(`${r.fromUser}-${r.toUser}`)
    );
    
    if (requestsToInsert.length > 0) {
      const result = await MeetingRequest.insertMany(requestsToInsert);
      console.log(`✓ Seeded ${result.length} meeting requests successfully`);
      result.forEach(req => {
        console.log(`  - ${req.fromUser} → ${req.toUser} (${req.status})`);
      });
    } else {
      console.log("✓ All meeting requests already exist in database");
    }
    
    // Verify seed data
    const totalSyncs = await StudySync.countDocuments();
    const totalRequests = await MeetingRequest.countDocuments();
    console.log(`\nTotal study syncs: ${totalSyncs}`);
    console.log(`Total meeting requests: ${totalRequests}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedData();

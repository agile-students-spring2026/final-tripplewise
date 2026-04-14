// Shared data store for requests and syncs to ensure consistency
let studySyncs = [
  {
    id: 1,
    title: "OS Study Group",
    datetime: new Date(Date.now() + 86400000).toISOString(),
    location: "Bobst Library",
    message: "Let's focus on chapter 4.",
    members: ["john_doe", "you"],
    maxMembers: 5,
    status: "active"
  },
  {
    id: 2,
    title: "Algorithms Review",
    datetime: new Date(Date.now() - 172800000).toISOString(),
    location: "Campus Cafe",
    message: "Recap sorting algorithms.",
    members: ["sarah_smith"],
    maxMembers: 4,
    status: "completed"
  },
];

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

function getStudySyncs() {
  return studySyncs;
}

function setStudySyncs(syncs) {
  studySyncs = syncs;
}

function getMeetingRequests() {
  return meetingRequests;
}

function setMeetingRequests(requests) {
  meetingRequests = requests;
}

module.exports = {
  getStudySyncs,
  setStudySyncs,
  getMeetingRequests,
  setMeetingRequests,
};

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

let meetingRequests = [];

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

import { useState } from "react";
import { styles } from "../styles";

export default function UserDashboard({ onLogout }) {
  const [studySyncs] = useState([
    {
      id: 1,
      date: "1/1/2026",
      time: "12:30 PM",
      location: "Bobst LL2",
      participants: ["John"],
    },
    {
      id: 2,
      date: "1/2/2026",
      time: "12:30 PM",
      location: "Bobst LL2",
      participants: ["James"],
    },
    {
      id: 3,
      date: "1/3/2026",
      time: "12:30 PM",
      location: "Bobst LL2",
      participants: ["Jack"],
    },
  ]);

  const [meetingRequests, setMeetingRequests] = useState([
    {
      id: 1,
      date: "1/1/2026",
      time: "12:30 PM",
      location: "Bobst LL2",
      participants: ["John"],
    },
    {
      id: 2,
      date: "1/2/2026",
      time: "12:30 PM",
      location: "Bobst LL2",
      participants: ["James"],
    },
    {
      id: 3,
      date: "1/3/2026",
      time: "12:30 PM",
      location: "Bobst LL2",
      participants: ["Jack"],
    },
  ]);

  const [selectedTab, setSelectedTab] = useState("syncs");

  const handleFindMatches = () => {
    console.log("Find New Matches clicked");
  };

  const handleOrganizeStudy = () => {
    console.log("Organize Study Syncs clicked");
  };

  const handleApproveMeeting = (id) => {
    setMeetingRequests(meetingRequests.filter((req) => req.id !== id));
  };

  const handleRejectMeeting = (id) => {
    setMeetingRequests(meetingRequests.filter((req) => req.id !== id));
  };

  const formatSyncEntry = (sync) => {
    return `${sync.date} ${sync.time} @ ${sync.location} W/ ${sync.participants.join(", ")}`;
  };

  return (
    <div style={styles.page}>
      {/* Header with Profile Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "0.15em",
            margin: 0,
          }}
        >
          USER'S DASHBOARD
        </h1>
        <button
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#d0d0d0",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
          title="Profile"
        >
          PROFILE
        </button>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={handleFindMatches}
          style={{
            flex: 1,
            backgroundColor: "black",
            color: "white",
            border: "none",
            padding: "14px 12px",
            fontSize: "13px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          FIND NEW<br />
          MATCHES
        </button>
        <button
          onClick={handleOrganizeStudy}
          style={{
            flex: 1,
            backgroundColor: "black",
            color: "white",
            border: "none",
            padding: "14px 12px",
            fontSize: "13px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: "0.05em",
          }}
        >
          ORGANIZE STUDY<br />
          SYNCS
        </button>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "16px",
          borderBottom: "2px solid #ccc",
        }}
      >
        <button
          onClick={() => setSelectedTab("syncs")}
          style={{
            padding: "10px 16px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "13px",
            fontWeight: "bold",
            cursor: "pointer",
            borderBottom: selectedTab === "syncs" ? "3px solid black" : "none",
            marginBottom: "-2px",
            letterSpacing: "0.05em",
          }}
        >
          UPCOMING STUDY SYNCS
        </button>
        <button
          onClick={() => setSelectedTab("requests")}
          style={{
            padding: "10px 16px",
            backgroundColor: "transparent",
            border: "none",
            fontSize: "13px",
            fontWeight: "bold",
            cursor: "pointer",
            borderBottom: selectedTab === "requests" ? "3px solid black" : "none",
            marginBottom: "-2px",
            letterSpacing: "0.05em",
          }}
        >
          MEETING REQUESTS
        </button>
      </div>

      {/* Content Area */}
      <div style={{ marginBottom: "20px" }}>
        {selectedTab === "syncs" && (
          <div>
            {studySyncs.length > 0 ? (
              <div
                style={{
                  border: "2px solid black",
                  backgroundColor: "white",
                  minHeight: "120px",
                }}
              >
                {studySyncs.map((sync, index) => (
                  <div
                    key={sync.id}
                    style={{
                      padding: "14px 12px",
                      borderBottom:
                        index < studySyncs.length - 1
                          ? "1px solid #ddd"
                          : "none",
                      fontSize: "12px",
                      lineHeight: "1.6",
                    }}
                  >
                    {formatSyncEntry(sync)}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  border: "2px solid black",
                  padding: "20px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                No upcoming study syncs. Find matches to get started!
              </div>
            )}
          </div>
        )}

        {selectedTab === "requests" && (
          <div>
            {meetingRequests.length > 0 ? (
              <div
                style={{
                  border: "2px solid black",
                  backgroundColor: "white",
                }}
              >
                {meetingRequests.map((request, index) => (
                  <div
                    key={request.id}
                    style={{
                      padding: "12px",
                      borderBottom:
                        index < meetingRequests.length - 1
                          ? "1px solid #ddd"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        marginBottom: "8px",
                        lineHeight: "1.6",
                      }}
                    >
                      {formatSyncEntry(request)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() => handleApproveMeeting(request.id)}
                        style={{
                          flex: 1,
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          padding: "8px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => handleRejectMeeting(request.id)}
                        style={{
                          flex: 1,
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          padding: "8px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        REJECT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  border: "2px solid black",
                  padding: "20px",
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                No pending meeting requests.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          width: "100%",
          backgroundColor: "black",
          color: "white",
          border: "none",
          padding: "12px",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          marginTop: "20px",
          letterSpacing: "0.05em",
        }}
      >
        LOGOUT
      </button>
    </div>
  );
}

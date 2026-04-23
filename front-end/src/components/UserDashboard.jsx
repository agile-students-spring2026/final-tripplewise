import { useState, useEffect, useCallback } from "react";
import { styles } from "../styles";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function UserDashboard({ onLogout, onFindMatches, onProfile, onOrganizeSyncs }) {
  const [studySyncs, setStudySyncs] = useState([]);
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [selectedTab, setSelectedTab] = useState("syncs");

  const fetchData = useCallback(async () => {
    try {
      // Fetch confirmed study syncs (auth required — returns only user's syncs)
      const syncsRes = await fetch(`${API_BASE}/api/syncs`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      const syncsData = await syncsRes.json();
      // syncs route now returns array directly (filtered by user)
      setStudySyncs(Array.isArray(syncsData) ? syncsData : []);

      // Fetch pending meeting requests (auth required — returns only requests TO this user)
      const requestsRes = await fetch(`${API_BASE}/api/requests`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      const requestsData = await requestsRes.json();
      // requests route now returns array directly (filtered by user)
      setMeetingRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch syncs and requests on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFindMatches = () => {
    onFindMatches();
  };

  const handleApproveMeeting = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/requests/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      if (response.ok) {
        setMeetingRequests(meetingRequests.filter((req) => req.id !== id));
        fetchData();
      }
    } catch (err) {
      console.error("Error approving meeting:", err);
    }
  };

  const handleRejectMeeting = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/requests/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      if (response.ok) {
        setMeetingRequests(meetingRequests.filter((req) => req.id !== id));
      }
    } catch (err) {
      console.error("Error rejecting meeting:", err);
    }
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
            color: "#555",
          }}
        >
          USER'S DASHBOARD
        </h1>
        <button
          onClick={onProfile}
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "#d0d0d0",
            border: "none",
            cursor: "pointer",
            fontSize: "8px",
            fontWeight: "bold",
            borderRadius: "4px",
            color: "#555",
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
          onClick={onOrganizeSyncs}
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
            color: "#555",
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
            color: "#555",
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
                    <div style={{ marginBottom: "6px", fontWeight: "bold" }}>
                      {sync.title}
                    </div>
                    <div style={{ color: "#666", marginBottom: "4px" }}>
                      {`${sync.datetime} @ ${sync.location}`}
                    </div>
                    <div style={{ color: "#888", fontSize: "11px" }}>
                      {`Members: ${sync.members ? sync.members.join(", ") : "N/A"}`}
                      {sync.maxMembers && ` (${sync.members?.length || 0}/${sync.maxMembers})`}
                    </div>
                    {sync.status && (
                      <div style={{ 
                        color: sync.status === "completed" ? "#888" : "#4CAF50",
                        fontSize: "10px",
                        marginTop: "4px",
                        textTransform: "uppercase"
                      }}>
                        Status: {sync.status}
                      </div>
                    )}
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
                      {`${request.date} ${request.time} @ ${request.location} - From ${request.fromUser}`}
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
    </div>
  );
}

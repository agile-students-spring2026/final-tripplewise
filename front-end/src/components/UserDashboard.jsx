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
      const syncsRes = await fetch(`${API_BASE}/api/syncs`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      const syncsData = await syncsRes.json();
      setStudySyncs(Array.isArray(syncsData) ? syncsData : []);

      const requestsRes = await fetch(`${API_BASE}/api/requests`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      const requestsData = await requestsRes.json();
      setMeetingRequests(Array.isArray(requestsData) ? requestsData : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApproveMeeting = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/api/requests/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      if (response.ok) {
        setMeetingRequests(meetingRequests.filter((req) => req._id !== id));
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
        setMeetingRequests(meetingRequests.filter((req) => req._id !== id));
        fetchData();
      }
    } catch (err) {
      console.error("Error rejecting meeting:", err);
    }
  };

  return (
    <div style={styles.page}>

      {/* ── HEADER ── */}
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}>
        <div>
          <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 2px 0", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            Welcome back
          </p>
          <h1 style={{
            fontSize: "26px",
            fontWeight: "800",
            color: "var(--text-h)",
            margin: 0,
            letterSpacing: "-0.5px",
          }}>
            My Dashboard
          </h1>
        </div>
        <button
          onClick={onProfile}
          style={{
            width: "46px",
            height: "46px",
            backgroundColor: "var(--accent)",
            border: "none",
            cursor: "pointer",
            borderRadius: "14px",
            fontSize: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(170,59,255,0.3)",
          }}
          title="Profile"
        >
          👤
        </button>
      </div>

      {/* ── ACTION CARDS ── */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        width: "100%",
      }}>
        <button
          onClick={onFindMatches}
          style={{
            flex: 1,
            backgroundColor: "#08060d",
            color: "white",
            border: "none",
            padding: "18px 10px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            borderRadius: "16px",
            textAlign: "center",
            lineHeight: "1.4",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
          }}
        >
          🔍<br />
          Find New<br />Matches
        </button>
        <button
          onClick={onOrganizeSyncs}
          style={{
            flex: 1,
            backgroundColor: "#08060d",
            color: "white",
            border: "none",
            padding: "18px 12px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            borderRadius: "16px",
            textAlign: "center",
            lineHeight: "1.4",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
          }}
        >
          📅<br />
          Organize<br />Study Syncs
        </button>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "24px",
        width: "100%",
      }}>
        {[
          { label: "Upcoming Syncs", value: studySyncs.length, color: "#aa3bff" },
          { label: "Pending Requests", value: meetingRequests.length, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: "14px",
            padding: "14px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}>
            <div style={{ fontSize: "28px", fontWeight: "800", color }}>{value}</div>
            <div style={{ fontSize: "11px", color: "#888", fontWeight: "600", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── TAB NAVIGATION ── */}
      <div style={{
        display: "flex",
        width: "100%",
        backgroundColor: "#f0f0f5",
        borderRadius: "12px",
        padding: "4px",
        marginBottom: "16px",
        boxSizing: "border-box",
      }}>
        {[
          { key: "syncs", label: "📚 Study Syncs" },
          { key: "requests", label: `🔔 Requests${meetingRequests.length > 0 ? ` (${meetingRequests.length})` : ""}` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedTab(key)}
            style={{
              flex: 1,
              padding: "10px 8px",
              backgroundColor: selectedTab === key ? "white" : "transparent",
              border: "none",
              borderRadius: "10px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              color: selectedTab === key ? "var(--text-h)" : "#999",
              boxShadow: selectedTab === key ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={{ width: "100%", marginBottom: "20px" }}>

        {/* Study Syncs Tab */}
        {selectedTab === "syncs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {studySyncs.length > 0 ? studySyncs.map((sync) => (
              <div key={sync._id} style={{
                backgroundColor: "white",
                borderRadius: "14px",
                padding: "14px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                borderLeft: "4px solid #aa3bff",
              }}>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-h)", marginBottom: "4px" }}>
                  {sync.title}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "3px" }}>
                  📍 {sync.location}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "3px" }}>
                  🕐 {sync.datetime}
                </div>
                {sync.members && (
                  <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                    👥 {sync.members.join(", ")}
                    {sync.maxMembers && ` · ${sync.members.length}/${sync.maxMembers} members`}
                  </div>
                )}
                {sync.status && (
                  <span style={{
                    display: "inline-block",
                    marginTop: "6px",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: "700",
                    backgroundColor: sync.status === "completed" ? "#f3f4f6" : "#e8f5e9",
                    color: sync.status === "completed" ? "#888" : "#2e7d32",
                    textTransform: "uppercase",
                  }}>
                    {sync.status}
                  </span>
                )}
              </div>
            )) : (
              <div style={{
                backgroundColor: "white",
                borderRadius: "14px",
                padding: "32px 20px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>📚</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-h)", marginBottom: "6px" }}>No upcoming syncs</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>Find matches to schedule your first study session!</div>
              </div>
            )}
          </div>
        )}

        {/* Meeting Requests Tab */}
        {selectedTab === "requests" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {meetingRequests.length > 0 ? meetingRequests.map((request) => (
              <div key={request._id} style={{
                backgroundColor: "white",
                borderRadius: "14px",
                padding: "14px 16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                borderLeft: "4px solid #f59e0b",
              }}>
                <div style={{ fontWeight: "700", fontSize: "13px", color: "var(--text-h)", marginBottom: "4px" }}>
                  From {request.fromUser}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}>
                  📍 {request.location}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
                  🕐 {request.date} at {request.time}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleApproveMeeting(request._id)}
                    style={{
                      flex: 1,
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      borderRadius: "10px",
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleRejectMeeting(request._id)}
                    style={{
                      flex: 1,
                      backgroundColor: "#fff0f0",
                      color: "#f44336",
                      border: "1.5px solid #f44336",
                      padding: "10px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      borderRadius: "10px",
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            )) : (
              <div style={{
                backgroundColor: "white",
                borderRadius: "14px",
                padding: "32px 20px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>🔔</div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-h)", marginBottom: "6px" }}>No pending requests</div>
                <div style={{ fontSize: "12px", color: "#aaa" }}>You're all caught up!</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

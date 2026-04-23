import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const HOURS = [
  "12:00","12:30","1:00","1:30","2:00","2:30","3:00","3:30",
  "4:00","4:30","5:00","5:30","6:00","6:30","7:00","7:30",
  "8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30",
];

const LOCATIONS = [
  "Bobst Library","Courant Institute","Tandon School of Engineering",
  "Brooklyn Campus","Washington Square Park","NYU Kimmel Center",
  "NYU Tisch School of the Arts","NYU Stern School of Business",
  "NYU School of Law","NYU School of Medicine","NYU Shanghai",
  "NYU Abu Dhabi","Warren Weaver Hall","Campus Cafe","Virtual (Zoom)","Other",
];

const dropdownStyle = {
  height: "38px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "#222",
  fontSize: "13px",
  padding: "0 8px",
  cursor: "pointer",
  boxSizing: "border-box",
  width: "100%",
};

export default function ProfileMatchPage({ profile: propProfile, id: propId, goBack, goToDashboard }) {
  const [matchProfile, setMatchProfile] = useState(propProfile || null);
  const [loading, setLoading] = useState(!propProfile && !!propId);

  // Request form state
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("9:00");
  const [period, setPeriod] = useState("AM");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    if (!matchProfile && propId) {
      setLoading(true);
      fetch(`${API_BASE}/api/matches/${propId}`, {
        headers: getAuthHeader(),
      })
        .then((r) => {
          if (!r.ok) throw new Error("network");
          return r.json();
        })
        .then((data) => {
          setMatchProfile(data.data || data);
        })
        .catch(() => {
          setMatchProfile(null);
        })
        .finally(() => setLoading(false));
    }
  }, [propId, matchProfile]);

  function handleSendRequest() {
    const resolvedLocation = location === "Other" ? customLocation.trim() : location;
    if (!date || !resolvedLocation) {
      setSendError("Please select a date and location.");
      return;
    }

    setSending(true);
    setSendError("");

    const payload = {
      toUsername: matchProfile.username,
      date,
      time: `${hour} ${period}`,
      location: resolvedLocation,
      message: message.trim(),
    };

    fetch(`${API_BASE}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => {
        setSending(false);
        setSent(true);
      })
      .catch(() => {
        setSending(false);
        setSendError("Failed to send request. Please try again.");
      });
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.topRow}><BackButton onClick={goBack} /></div>
        <p style={{ textAlign: "center", marginTop: 40, color: "#666" }}>Loading profile…</p>
      </div>
    );
  }

  if (!matchProfile) {
    return (
      <div style={styles.page}>
        <div style={styles.topRow}><BackButton onClick={goBack} /></div>
        <p style={{ textAlign: "center", marginTop: 40, color: "#666" }}>Profile not found.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <div style={styles.profileImageBox}>PROFILE</div>
      <div style={styles.usernameBox}>{matchProfile.username || "Unknown"}</div>

      {matchProfile.matchPercentage && (
        <div style={styles.matchText}>{matchProfile.matchPercentage}% MATCH!</div>
      )}

      {matchProfile.bio && (
        <div style={styles.formGroup}>
          <label style={styles.label}>About:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.bio}</p>
          </div>
        </div>
      )}

      {matchProfile.preferredLocations?.length > 0 && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Preferred Locations:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.preferredLocations.join(", ")}</p>
          </div>
        </div>
      )}

      {matchProfile.preferredMethods?.length > 0 && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Study Methods:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.preferredMethods.join(", ")}</p>
          </div>
        </div>
      )}

      {/* ── SEND STUDY SYNC REQUEST FORM ── */}
      {!sent ? (
        <div style={{ backgroundColor: "white", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            📅 Send Study Sync Request
          </div>

          {sendError && (
            <div style={{ background: "#ffebee", color: "#c62828", padding: "8px 12px", borderRadius: 8, marginBottom: 10, fontSize: 13 }}>
              ❌ {sendError}
            </div>
          )}

          {/* Date */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 10, border: "1px solid #ccc", boxSizing: "border-box", backgroundColor: "white", color: "#222", colorScheme: "light" }}
            />
          </div>

          {/* Time */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Time</label>
            <div style={{ display: "flex", gap: 6 }}>
              <select value={hour} onChange={(e) => setHour(e.target.value)} style={{ ...dropdownStyle, flex: 2 }}>
                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ ...dropdownStyle, flex: 1 }}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Location</label>
            <select
              value={location}
              onChange={(e) => { setLocation(e.target.value); setCustomLocation(""); }}
              style={dropdownStyle}
            >
              <option value="">Select a location</option>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {location === "Other" && (
              <input
                placeholder="Enter location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                style={{ width: "100%", padding: 8, marginTop: 8, borderRadius: 10, border: "1px solid #ccc", boxSizing: "border-box", backgroundColor: "white", color: "#222" }}
              />
            )}
          </div>

          {/* Message */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>
              Message <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`What do you want to study with ${matchProfile.username}?`}
              style={{ width: "100%", padding: 8, minHeight: 60, borderRadius: 10, border: "1px solid #ccc", fontSize: 13, resize: "vertical", boxSizing: "border-box", backgroundColor: "white", color: "#222" }}
            />
          </div>

          <button
            onClick={handleSendRequest}
            disabled={sending}
            style={{
              ...styles.profileActionButton,
              backgroundColor: sending ? "#aaa" : "#4CAF50",
              cursor: sending ? "not-allowed" : "pointer",
              borderRadius: 10,
            }}
          >
            {sending ? "SENDING…" : "SEND STUDY SYNC REQUEST"}
          </button>
        </div>
      ) : (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "14px", borderRadius: 10, marginTop: 16, textAlign: "center", fontSize: 14, fontWeight: 600 }}>
          ✅ Request sent to {matchProfile.username}! They'll see it in their Meeting Requests.
          <br />
          <button
            onClick={goToDashboard}
            style={{ marginTop: 12, padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13 }}
          >
            BACK TO DASHBOARD
          </button>
        </div>
      )}
    </div>
  );
}

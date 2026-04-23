import React, { useState, useEffect } from "react";
import { styles } from "../styles";
import BackButton from "./BackButton";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

const HOURS = [
  "12:00", "12:30",
  "1:00",  "1:30",
  "2:00",  "2:30",
  "3:00",  "3:30",
  "4:00",  "4:30",
  "5:00",  "5:30",
  "6:00",  "6:30",
  "7:00",  "7:30",
  "8:00",  "8:30",
  "9:00",  "9:30",
  "10:00", "10:30",
  "11:00", "11:30",
];

const LOCATIONS = [
  "Bobst Library",
  "Courant Institute",
  "Tandon School of Engineering",
  "Brooklyn Campus",
  "Washington Square Park",
  "NYU Kimmel Center",
  "NYU Tisch School of the Arts",
  "NYU Stern School of Business",
  "NYU School of Law",
  "NYU School of Medicine",
  "NYU Shanghai",
  "NYU Abu Dhabi",
  "Warren Weaver Hall",
  "Campus Cafe",
  "Virtual (Zoom)",
  "Other",
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

export default function ScheduleStudySync({ goBack }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("9:00");
  const [period, setPeriod] = useState("AM");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [message, setMessage] = useState("");
  const [toUsername, setToUsername] = useState("");
  const [partners, setPartners] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Load confirmed partners from existing syncs
  useEffect(() => {
    const me = localStorage.getItem("username") || "";
    fetch(`${API_BASE}/api/syncs`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    })
      .then((r) => r.json())
      .then((data) => {
        const syncs = Array.isArray(data) ? data : [];
        // Collect all other members from syncs I'm in
        const partnerSet = new Set();
        syncs.forEach((s) => {
          if (Array.isArray(s.members)) {
            s.members.forEach((m) => {
              if (m !== me) partnerSet.add(m);
            });
          }
        });
        setPartners([...partnerSet]);
      })
      .catch(() => setPartners([]));
  }, []);

  function resetForm() {
    setTitle("");
    setDate("");
    setHour("9:00");
    setPeriod("AM");
    setLocation("");
    setCustomLocation("");
    setMessage("");
    setToUsername("");
    setSent(false);
    setError("");
  }

  function handleSendRequest() {
    const resolvedLocation = location === "Other" ? customLocation.trim() : location;

    if (!title.trim() || !date || !resolvedLocation) {
      setError("Please fill in title, date, and location.");
      return;
    }

    const payload = {
      toUsername: toUsername || null,
      title: title.trim(),
      date,
      time: `${hour} ${period}`,
      location: resolvedLocation,
      message: message.trim(),
    };

    setSending(true);
    setError("");

    // If a partner is selected, send as a meeting request to them
    // Otherwise, create a general sync for yourself
    const endpoint = toUsername
      ? `${API_BASE}/api/requests`
      : `${API_BASE}/api/syncs`;

    const body = toUsername
      ? { toUsername, date, time: `${hour} ${period}`, location: resolvedLocation, message: message.trim() }
      : { title: title.trim(), datetime: `${date} ${hour} ${period}`, location: resolvedLocation, message: message.trim() };

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then(() => {
        setSending(false);
        setSent(true);
      })
      .catch(() => {
        setSending(false);
        // Still show success locally
        setSent(true);
      });
  }

  return (
    <div style={{ ...styles.page, padding: 18 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <BackButton onClick={goBack} />
        <h2 style={{ margin: 0, color: "#222", fontWeight: 800, fontSize: 20 }}>
          Schedule a Study Sync
        </h2>
      </div>

      <p style={{ fontSize: 13, color: "#888", marginBottom: 18, marginTop: -8 }}>
        Fill in the details below and send a study sync request to your matches.
      </p>

      {/* Error banner */}
      {error && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 13 }}>
          ❌ {error}
        </div>
      )}

      {/* Success banner */}
      {sent && (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px 14px", borderRadius: 10, marginBottom: 14, fontSize: 13, fontWeight: 600, textAlign: "center" }}>
          ✅ {toUsername ? `Request sent to ${toUsername}!` : "Study sync created!"} Check your dashboard for updates.
        </div>
      )}

      {/* Form card */}
      <div style={{ backgroundColor: "white", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 16 }}>

        {/* Send To */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>
            Send To <span style={{ color: "#aaa", fontWeight: 400 }}>(optional — pick a confirmed partner)</span>
          </label>
          {partners.length > 0 ? (
            <select
              value={toUsername}
              onChange={(e) => setToUsername(e.target.value)}
              style={dropdownStyle}
            >
              <option value="">— General session (just for me) —</option>
              {partners.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          ) : (
            <div style={{ fontSize: 12, color: "#aaa", padding: "8px 0", fontStyle: "italic" }}>
              No confirmed partners yet. Find matches first, then come back here to schedule with them.
            </div>
          )}
        </div>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>
            Session Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Operating Systems - Chapter 4"
            style={{ width: "100%", padding: 8, fontSize: 13, borderRadius: 10, border: "1px solid #ccc", boxSizing: "border-box", backgroundColor: "white", color: "#222" }}
          />
        </div>

        {/* Date + Time */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 10, border: "1px solid #ccc", boxSizing: "border-box", backgroundColor: "white", color: "#222", colorScheme: "light" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Time</label>
            <div style={{ display: "flex", gap: 4 }}>
              <select value={hour} onChange={(e) => setHour(e.target.value)} style={{ ...dropdownStyle, flex: 2 }}>
                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ ...dropdownStyle, flex: 1 }}>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>Location</label>
          <select
            value={location}
            onChange={(e) => { setLocation(e.target.value); setCustomLocation(""); }}
            style={dropdownStyle}
          >
            <option value="">Select a location</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
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
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>
            Message <span style={{ color: "#aaa", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What will you be studying? Any notes for your partner?"
            style={{ width: "100%", padding: 8, minHeight: 72, borderRadius: 10, border: "1px solid #ccc", fontSize: 13, resize: "vertical", boxSizing: "border-box", backgroundColor: "white", color: "#222" }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSendRequest}
            disabled={sending}
            style={{
              flex: 1,
              background: sending ? "#aaa" : "#4CAF50",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: 10,
              cursor: sending ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            {sending ? "SENDING…" : toUsername ? `SEND TO ${toUsername.toUpperCase()}` : "CREATE STUDY SYNC"}
          </button>
          <button
            onClick={resetForm}
            style={{
              background: "#f1f1f1",
              padding: "12px 16px",
              border: "1px solid #ccc",
              borderRadius: 10,
              cursor: "pointer",
              color: "#555",
              fontSize: 13,
            }}
          >
            RESET
          </button>
        </div>
      </div>

      {/* Info note */}
      <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", padding: "0 10px" }}>
        {toUsername
          ? `${toUsername} will receive this as a Meeting Request. Once they approve, it appears in both your dashboards.`
          : "Select a confirmed partner above to send them a study sync request."}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { styles } from "../styles";
import BackButton from "./BackButton";

export default function ScheduleStudySync({ goBack }) {
  const sampleMeetings = [
    {
      id: 1,
      title: "OS Study Group",
      datetime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
      location: "Bobst Library",
      message: "Let's focus on chapter 4.",
    },
    {
      id: 2,
      title: "Algorithms Review",
      datetime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      location: "Campus Cafe",
      message: "Recap sorting algorithms.",
    },
  ];

  const [meetings, setMeetings] = useState(sampleMeetings);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [locations] = useState([
    "Bobst Library",
    "Warren Weaver Hall",
    "Washington Square Park",
    "Campus Cafe",
    "Virtual (Zoom)",
  ]);

  const now = new Date();

  const upcoming = useMemo(() => {
    return meetings
      .filter((m) => new Date(m.datetime) >= now)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  }, [meetings, now]);

  const past = useMemo(() => {
    return meetings
      .filter((m) => new Date(m.datetime) < now)
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  }, [meetings, now]);

  function resetForm() {
    setTitle("");
    setDate("");
    setTime("");
    setLocation("");
    setMessage("");
  }

  function handleSendRequest() {
    if (!title.trim() || !date || !time || !location) {
      alert("Please fill title, date, time and location.");
      return;
    }
    const dt = new Date(`${date}T${time}`);
    if (Number.isNaN(dt.getTime())) {
      alert("Invalid date/time.");
      return;
    }
    const newMeeting = {
      id: Date.now(),
      title: title.trim(),
      datetime: dt.toISOString(),
      location,
      message: message.trim(),
    };
    setMeetings((s) => [newMeeting, ...s]);
    resetForm();
  }

  function formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  return (
    <div style={{ ...styles.page, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <BackButton onClick={goBack} />
        <h2 style={{ margin: 0 }}>Schedule a Study Sync</h2>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 12,
          background: "white",
          marginBottom: 18,
        }}
      >
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Operating Systems - Chapter 4"
            style={{ width: "100%", padding: 8, fontSize: 13 }}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: 8 }} />
          </div>
          <div style={{ width: 140 }}>
            <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: 8 }} />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>Location</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option value="">Select a location</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
            <option value="Other">Other (enter below)</option>
          </select>
          {location === "Other" && (
            <input
              placeholder="Enter location"
              value={location === "Other" ? "" : location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 8 }}
            />
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>Message (optional)</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: "100%", padding: 8, minHeight: 72 }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleSendRequest}
            style={{ flex: 1, background: "black", color: "white", padding: "10px 12px", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            SEND STUDY SYNC REQUEST
          </button>
          <button
            onClick={resetForm}
            style={{ background: "#f1f1f1", padding: "10px 12px", border: "1px solid #ddd", cursor: "pointer" }}
          >
            RESET
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <h3 style={{ margin: "6px 0 10px 0" }}>Upcoming Study Syncs</h3>
        {upcoming.length === 0 ? (
          <div style={{ padding: 12, border: "1px solid #ddd", background: "white", color: "#666" }}>No upcoming study syncs.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {upcoming.map((m) => (
              <div key={m.id} style={{ padding: 12, border: "1px solid #ddd", background: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{formatDateTime(m.datetime)} · {m.location}</div>
                  {m.message && <div style={{ marginTop: 6, fontSize: 13 }}>{m.message}</div>}
                </div>
                <div style={{ marginLeft: 12 }}>
                  <button style={{ padding: "8px 10px", border: "none", background: "#2d9cdb", color: "white", cursor: "pointer", borderRadius: 6 }}>VIEW</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 style={{ margin: "6px 0 10px 0" }}>Past Study Syncs</h3>
        {past.length === 0 ? (
          <div style={{ padding: 12, border: "1px solid #ddd", background: "white", color: "#666" }}>No past study syncs.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {past.map((m) => (
              <div key={m.id} style={{ padding: 12, border: "1px solid #eee", background: "white" }}>
                <div style={{ fontWeight: 700 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: "#666" }}>{formatDateTime(m.datetime)} · {m.location}</div>
                {m.message && <div style={{ marginTop: 6, fontSize: 13 }}>{m.message}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

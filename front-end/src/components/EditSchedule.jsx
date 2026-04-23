import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

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

const dropdownStyle = {
  height: "38px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  padding: "0 8px",
  cursor: "pointer",
  boxSizing: "border-box",
};

// Edit Schedule – loads from GET /api/users/me and saves via PUT /api/users/me/schedule
export default function EditSchedule({ goBack }) {
  const [classes, setClasses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // "saved" | "error"

  // Load the user's current schedule on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.schedule) && data.schedule.length) {
          // Normalize existing entries to have hour + period + day fields
          const normalized = data.schedule.map((c) => {
            let hour = "9:00";
            let period = "AM";
            // If time is already "9:00 AM" format, split it
            if (c.time && c.time.includes(" ")) {
              const parts = c.time.split(" ");
              hour = parts[0] || "9:00";
              period = parts[1] || "AM";
            }
            return {
              ...c,
              hour,
              period,
              day: c.day || "",   // preserve saved day
            };
          });
          setClasses(normalized);
        } else {
          setClasses([{ id: Date.now(), name: "", day: "", hour: "9:00", period: "AM" }]);
        }
      })
      .catch(() => {
        setClasses([{ id: Date.now(), name: "", day: "", hour: "9:00", period: "AM" }]);
      });
  }, []);

  function updateClass(idx, field, value) {
    setClasses((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  function addClass() {
    setClasses((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: "", day: "", hour: "9:00", period: "AM" },
    ]);
  }

  function removeClass(idx) {
    setClasses((prev) => prev.filter((_, i) => i !== idx));
  }

  function saveChanges() {
    setSaving(true);
    setStatus(null);

    // Convert hour + period back to "9:00 AM" format for storage
    const payload = classes.map((c) => ({
      id:   c.id,
      name: c.name,
      day:  c.day || "",
      time: `${c.hour} ${c.period}`,
    }));

    const token = localStorage.getItem("token");
    fetch("/api/users/me/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then(() => {
        setSaving(false);
        setStatus("saved");
        setTimeout(() => goBack(), 800);
      })
      .catch(() => {
        setSaving(false);
        setStatus("error");
      });
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2 style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
        color: "#555",
      }}>
        EDIT SCHEDULE
      </h2>

      {status === "saved" && (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Schedule saved!
        </div>
      )}
      {status === "error" && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Failed to save. Please try again.
        </div>
      )}

      {/* Class rows */}
      {classes.map((c, idx) => (
        <div key={c.id} style={{ marginBottom: 16, padding: "12px", border: "1px solid #eee", borderRadius: 8, background: "white" }}>
          {/* Class name */}
          <label style={styles.label}>Class {idx + 1}:</label>
          <input
            type="text"
            placeholder="Class name"
            value={c.name}
            onChange={(e) => updateClass(idx, "name", e.target.value)}
            style={{ ...styles.input, width: "100%", marginBottom: 8, boxSizing: "border-box" }}
          />

          {/* Day + Time row */}
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
            <div style={{ flex: 2 }}>
              <label style={{ ...styles.label, fontSize: 11 }}>📅 Day:</label>
              <select
                value={c.day || ""}
                onChange={(e) => updateClass(idx, "day", e.target.value)}
                style={{ ...dropdownStyle, width: "100%" }}
              >
                <option value="">Select day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ ...styles.label, fontSize: 11 }}>Time:</label>
              <select
                value={c.hour}
                onChange={(e) => updateClass(idx, "hour", e.target.value)}
                style={{ ...dropdownStyle, width: "100%" }}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: "0 0 64px" }}>
              <label style={{ ...styles.label, fontSize: 11 }}>AM/PM:</label>
              <select
                value={c.period}
                onChange={(e) => updateClass(idx, "period", e.target.value)}
                style={{ ...dropdownStyle, width: "100%" }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={() => removeClass(idx)}
            style={{
              marginTop: 8,
              padding: "4px 10px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {/* Add Class + Save buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          onClick={addClass}
          style={{
            flex: 1,
            padding: "12px",
            background: "#2ecc71",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          ADD CLASS
        </button>

        <button
          type="button"
          onClick={saveChanges}
          disabled={saving}
          style={{
            flex: 1,
            padding: "12px",
            background: saving ? "#aaa" : "#4CAF50",
            color: "white",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          {saving ? "SAVING…" : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}

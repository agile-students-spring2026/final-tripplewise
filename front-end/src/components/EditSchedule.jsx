import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

// Edit Schedule – loads from GET /api/users/me and saves via PUT /api/users/me/schedule
export default function EditSchedule({ goBack }) {
  const [classes, setClasses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // "saved" | "error"

  // Load the user's current schedule on mount
  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.schedule) && data.schedule.length) {
          setClasses(data.schedule);
        } else {
          setClasses([{ id: Date.now(), name: "", time: "09:00" }]);
        }
      })
      .catch(() => {
        setClasses([{ id: Date.now(), name: "", time: "09:00" }]);
      });
  }, []);

  function saveChanges() {
    setSaving(true);
    setStatus(null);
    fetch("/api/users/me/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classes),
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

      <h2 style={{ marginTop: 20, color: "#555" }}>Edit Schedule</h2>

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

      <div style={{ width: "100%", maxWidth: 700 }}>
        {classes.map((c, idx) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <input
              type="text"
              placeholder={`Class name #${idx + 1}`}
              value={c.name}
              onChange={(e) => {
                const next = [...classes];
                next[idx] = { ...next[idx], name: e.target.value };
                setClasses(next);
              }}
              style={{ flex: 2, padding: 8 }}
            />

            <input
              type="time"
              value={c.time}
              onChange={(e) => {
                const next = [...classes];
                next[idx] = { ...next[idx], time: e.target.value };
                setClasses(next);
              }}
              style={{ flex: 1, padding: 8 }}
            />

            <button
              type="button"
              onClick={() => setClasses((prev) => prev.filter((_, i) => i !== idx))}
              style={{
                padding: "8px 12px",
                background: "#e74c3c",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: 4,
              }}
            >
              Remove
            </button>
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            type="button"
            onClick={() =>
              setClasses((prev) => [
                ...prev,
                { id: Date.now() + Math.random(), name: "", time: "09:00" },
              ])
            }
            style={{
              padding: "8px 12px",
              background: "#2ecc71",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Add Class
          </button>

          <button
            type="button"
            onClick={saveChanges}
            disabled={saving}
            style={{
              padding: "8px 12px",
              background: saving ? "#aaa" : "#3498db",
              color: "white",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              borderRadius: 4,
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";
// This is the second page of the sign-up process.
export default function SignUpPageTwo({ goBack, goNext, onSave }) {
  const [classes, setClasses] = useState([
    { id: Date.now(), name: "", time: "09:00" },
  ]);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) setClasses(data);
      })
      .catch(() => {});
  }, []);
  // Add a new class to the schedule
  function addClass() {
    setClasses((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), name: "", time: "09:00" },
    ]);
  }
  // Update an existing class in the schedule
  function updateClass(idx, field, value) {
    setClasses((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  function removeClass(idx) {
    setClasses((prev) => prev.filter((_, i) => i !== idx));
  }

function saveChanges() {
    try {
      // POST to backend
      fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(classes),
      })
        .then((r) => r.json())
        .then(() => {
          if (typeof onSave === "function") onSave(classes);
          if (typeof goNext === "function") goNext();
          else alert("Schedule saved");
        });
    } catch (e) {
      // ignore
    }
  }


    return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2 style={{ marginTop: 20, color: "#555" }}>Edit Schedule</h2>

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
              }}
            >
              Remove
            </button>
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => setClasses((prev) => [...prev, { id: Date.now() + Math.random(), name: "", time: "09:00" }])}
            style={{
              padding: "8px 12px",
              background: "#2ecc71",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add Class
          </button>

          <button
            type="button"
            onClick={saveChanges}
            style={{
              padding: "8px 12px",
              background: "#3498db",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
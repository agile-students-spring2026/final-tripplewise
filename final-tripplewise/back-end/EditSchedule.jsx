import React, { useState, useEffect } from "react";
import BackButton from "../front-end/src/components/BackButton";
import { styles } from "../front-end/src/styles";
// This is the second page of the sign-up process, where users can edit their schedule.
export default function SignUpPageTwo({ goBack, goNext, onSave }) {
  const [classes, setClasses] = useState([
    { id: Date.now(), name: "", time: "09:00" },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("schedule");
      if (saved) setClasses(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
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
      localStorage.setItem("schedule", JSON.stringify(classes));
    } catch (e) {
      // ignore
    }
    if (typeof onSave === "function") onSave(classes);
    // optional: move to next step if provided
    if (typeof goNext === "function") goNext();
    else alert("Schedule saved");
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2 style={{ marginTop: 20 }}>Edit Schedule</h2>

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
              onChange={(e) => updateClass(idx, "name", e.target.value)}
              style={{ flex: 2, padding: 8 }}
            />

            <input
              type="time"
              value={c.time}
              onChange={(e) => updateClass(idx, "time", e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />

            <button
              type="button"
              onClick={() => removeClass(idx)}
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
            onClick={addClass}
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
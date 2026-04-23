import React, { useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

// Hour options for the time dropdown
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
  height: "34px",
  borderRadius: "8px",
  border: "1px solid black",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  padding: "0 6px",
  cursor: "pointer",
};

export default function SignUpPageTwo({ goBack, goNext, onComplete, initialUsername = "" }) {
  // Schedule: 4 class slots (hour + AM/PM stored separately)
  const [classes, setClasses] = useState([
    { name: "", hour: "9:00", period: "AM" },
    { name: "", hour: "9:00", period: "AM" },
    { name: "", hour: "9:00", period: "AM" },
    { name: "", hour: "9:00", period: "AM" },
  ]);

  // Preferred study locations: 3 slots
  const [locations, setLocations] = useState(["", "", ""]);

  // Preferred study methods: 2 slots
  const [methods, setMethods] = useState(["", ""]);

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const saveBg = saving ? "rgba(11,11,11,0.9)" : (styles.mainButton?.backgroundColor || "#0c0c0c");


  function updateClass(idx, field, value) {
    setClasses((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  }

  function updateLocation(idx, value) {
    setLocations((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }

  function updateMethod(idx, value) {
    setMethods((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }

  async function finishSignup() {
    const token = localStorage.getItem("token");
    setError("");
    setSaving(true);

    // Combine hour + period into a readable time string e.g. "9:00 AM"
    const filledClasses = classes
      .filter((c) => c.name.trim())
      .map((c, i) => ({
        id:   Date.now() + i,
        name: c.name.trim(),
        time: `${c.hour} ${c.period}`,
      }));

    const filledLocations = locations.filter((l) => l.trim());
    const filledMethods   = methods.filter((m) => m.trim());

    try {
      // Save schedule
      if (filledClasses.length > 0) {
        await fetch("/api/users/me/schedule", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(filledClasses),
        });
      }

      // Save locations
      if (filledLocations.length > 0) {
        await fetch("/api/users/me/locations", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ locations: filledLocations }),
        });
      }

      // Save methods
      if (filledMethods.length > 0) {
        await fetch("/api/users/me/methods", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ methods: filledMethods }),
        });
      }

      // Fetch the updated user to pass back to App
      const res  = await fetch("/api/users/me", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      const user = await res.json();

      setSaving(false);
      if (typeof onComplete === "function") onComplete(user);
      else if (typeof goNext === "function") goNext();
    } catch (err) {
      setSaving(false);
      setError("Could not connect to backend. Please try again.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h1 style={styles.bigTitle}>SET UP PROFILE</h1>

      {error && (
        <p style={{ color: "red", marginBottom: "12px", textAlign: "center" }}>{error}</p>
      )}

      {/* CLASS + TIME (hour dropdown + AM/PM dropdown) */}
      {classes.map((c, idx) => (
        <div key={idx} style={{ marginBottom: 14 }}>
          <div style={styles.doubleInputRow}>
            {/* Class name */}
            <div style={styles.halfInputGroup}>
              <label style={styles.label}>Add Class {idx + 1}:</label>
              <input
                type="text"
                style={styles.input}
                value={c.name}
                onChange={(e) => updateClass(idx, "name", e.target.value)}
                placeholder={`Class ${idx + 1}`}
              />
            </div>

            {/* Time: hour + AM/PM */}
            <div style={styles.halfInputGroup}>
              <label style={styles.label}>Time:</label>
              <div style={{ display: "flex", gap: 6 }}>
                <select
                  value={c.hour}
                  onChange={(e) => updateClass(idx, "hour", e.target.value)}
                  style={{ ...dropdownStyle, flex: 2 }}
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <select
                  value={c.period}
                  onChange={(e) => updateClass(idx, "period", e.target.value)}
                  style={{ ...dropdownStyle, flex: 1 }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* PREFERRED STUDY LOCATIONS */}
      {locations.map((loc, idx) => (
        <div key={idx} style={styles.formGroup}>
          <label style={styles.label}>Preferred Study Location {idx + 1}:</label>
          <input
            type="text"
            style={styles.input}
            value={loc}
            onChange={(e) => updateLocation(idx, e.target.value)}
            placeholder="e.g. Bobst Library"
          />
        </div>
      ))}

      {/* PREFERRED STUDY METHODS */}
      {methods.map((method, idx) => (
        <div key={idx} style={styles.formGroup}>
          <label style={styles.label}>Preferred Study Method {idx + 1}:</label>
          <input
            type="text"
            style={styles.input}
            value={method}
            onChange={(e) => updateMethod(idx, e.target.value)}
            placeholder="e.g. Group Study"
          />
        </div>
      ))}

      {/* SUBMIT BUTTON */}
      <button
        style={{
          ...styles.mainButton,
          backgroundColor: saveBg,
          cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.95 : 1,
        }}
        onClick={finishSignup}
        disabled={saving}
      >
        {saving ? "SAVING…" : "FINISH CREATING ACCOUNT"}
      </button>
    </div>
  );
}

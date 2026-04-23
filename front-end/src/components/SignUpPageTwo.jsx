import React, { useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

const HOURS = [
  "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30",
  "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
];

const MAJORS = ["Computer Science", "Mathematics", "Art History", "Physics", "Electrical Engineering", "Finance", "Accounting"];

const LOCATION_OPTIONS = [
  "Bobst Library", "Courant Institute", "Tandon School of Engineering", "Brooklyn Campus", "Washington Square Park",
  "NYU Kimmel Center", "NYU Tisch School of the Arts", "NYU Stern School of Business", "NYU School of Law",
  "NYU School of Medicine", "NYU Shanghai", "NYU Abu Dhabi", "Other"
];

const METHOD_OPTIONS = [
  "Flashcards", "Group Study", "Solo Study", "Teaching Others", "Practice Problems", "Mind Mapping",
  "Summarization", "Pomodoro Technique", "Active Recall", "Spaced Repetition", "Visual Learning",
  "Auditory Learning", "Reading Aloud", "Note Taking", "Other"
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
  width: "100%"
};

export default function SignUpPageTwo({ goBack, goNext, onComplete }) {
  const [name, setName] = useState("");
  const [major, setMajor] = useState(MAJORS[0]);
  
  const [classes, setClasses] = useState([
    { name: "", hour: "9:00", period: "AM" },
    { name: "", hour: "9:00", period: "AM" },
    { name: "", hour: "9:00", period: "AM" },
    { name: "", hour: "9:00", period: "AM" },
  ]);

  // Stores { selection: "Bobst...", custom: "" }
  const [locations, setLocations] = useState([{ selection: "", custom: "" }, { selection: "", custom: "" }, { selection: "", custom: "" }]);
  const [methods, setMethods] = useState([{ selection: "", custom: "" }, { selection: "", custom: "" }]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const saveBg = saving ? "rgba(11,11,11,0.9)" : (styles.mainButton?.backgroundColor || "#0c0c0c");

  const updateClass = (idx, field, value) => {
    setClasses(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const updateLocation = (idx, field, value) => {
    setLocations(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const updateMethod = (idx, field, value) => {
    setMethods(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  async function finishSignup() {
    const token = localStorage.getItem("token");
    setError("");
    setSaving(true);

    const filledClasses = classes.filter(c => c.name.trim()).map((c, i) => ({
      id: Date.now() + i,
      name: c.name.trim(),
      time: `${c.hour} ${c.period}`,
    }));

    const filledLocations = locations
      .map(l => (l.selection === "Other" ? l.custom : l.selection))
      .filter(l => l && l.trim());

    const filledMethods = methods
      .map(m => (m.selection === "Other" ? m.custom : m.selection))
      .filter(m => m && m.trim());

    try {
      // Basic profile update (Name and Major)
      await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, major }),
      });

      if (filledClasses.length > 0) {
        await fetch("/api/users/me/schedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(filledClasses),
        });
      }

      if (filledLocations.length > 0) {
        await fetch("/api/users/me/locations", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ locations: filledLocations }),
        });
      }

      if (filledMethods.length > 0) {
        await fetch("/api/users/me/methods", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ methods: filledMethods }),
        });
      }

      const res = await fetch("/api/users/me", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      <div style={styles.topRow}><BackButton onClick={goBack} /></div>
      <h1 style={styles.bigTitle}>SET UP PROFILE</h1>
      {error && <p style={{ color: "red", marginBottom: "12px", textAlign: "center" }}>{error}</p>}

      {/* NAME & MAJOR */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Full Name:</label>
        <input type="text" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Major:</label>
        <select style={dropdownStyle} value={major} onChange={(e) => setMajor(e.target.value)}>
          {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* CLASSES */}
      {classes.map((c, idx) => (
        <div key={idx} style={{ marginBottom: 14 }}>
          <div style={styles.doubleInputRow}>
            <div style={styles.halfInputGroup}>
              <label style={styles.label}>Class {idx + 1}:</label>
              <input type="text" style={styles.input} value={c.name} onChange={(e) => updateClass(idx, "name", e.target.value)} placeholder="Class Name" />
            </div>
            <div style={styles.halfInputGroup}>
              <label style={styles.label}>Time:</label>
              <div style={{ display: "flex", gap: 6 }}>
                <select value={c.hour} onChange={(e) => updateClass(idx, "hour", e.target.value)} style={{ ...dropdownStyle, flex: 2 }}>
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={c.period} onChange={(e) => updateClass(idx, "period", e.target.value)} style={{ ...dropdownStyle, flex: 1 }}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* LOCATIONS */}
      {locations.map((loc, idx) => (
        <div key={idx} style={styles.formGroup}>
          <label style={styles.label}>Study Location {idx + 1}:</label>
          <select 
            style={dropdownStyle} 
            value={loc.selection} 
            onChange={(e) => updateLocation(idx, "selection", e.target.value)}
          >
            <option value="">Select a location</option>
            {LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {loc.selection === "Other" && (
            <input 
              type="text" 
              style={{ ...styles.input, marginTop: "8px" }} 
              placeholder="Enter custom location" 
              value={loc.custom} 
              onChange={(e) => updateLocation(idx, "custom", e.target.value)} 
            />
          )}
        </div>
      ))}

      {/* METHODS */}
      {methods.map((meth, idx) => (
        <div key={idx} style={styles.formGroup}>
          <label style={styles.label}>Study Method {idx + 1}:</label>
          <select 
            style={dropdownStyle} 
            value={meth.selection} 
            onChange={(e) => updateMethod(idx, "selection", e.target.value)}
          >
            <option value="">Select a method</option>
            {METHOD_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {meth.selection === "Other" && (
            <input 
              type="text" 
              style={{ ...styles.input, marginTop: "8px" }} 
              placeholder="Enter custom method" 
              value={meth.custom} 
              onChange={(e) => updateMethod(idx, "custom", e.target.value)} 
            />
          )}
        </div>
      ))}

      <button
        style={{ ...styles.mainButton, backgroundColor: saveBg, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.95 : 1 }}
        onClick={finishSignup}
        disabled={saving}
      >
        {saving ? "SAVING…" : "FINISH CREATING ACCOUNT"}
      </button>
    </div>
  );
}
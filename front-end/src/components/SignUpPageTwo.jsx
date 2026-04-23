import React, { useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

const HOURS = [
  "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30",
  "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30",
  "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
];

const MAJORS = [
  "Computer Science", "Mathematics", "Art History", "Physics",
  "Electrical Engineering", "Finance", "Accounting",
];

const LOCATION_OPTIONS = [
  "Bobst Library", "Courant Institute", "Tandon School of Engineering",
  "Brooklyn Campus", "Washington Square Park", "NYU Kimmel Center",
  "NYU Tisch School of the Arts", "NYU Stern School of Business",
  "NYU School of Law", "NYU School of Medicine", "NYU Shanghai",
  "NYU Abu Dhabi", "Other",
];

const METHOD_OPTIONS = [
  "Flashcards", "Group Study", "Solo Study", "Teaching Others",
  "Practice Problems", "Mind Mapping", "Summarization", "Pomodoro Technique",
  "Active Recall", "Spaced Repetition", "Visual Learning", "Auditory Learning",
  "Reading Aloud", "Note Taking", "Other",
];

const card = {
  backgroundColor: "white",
  borderRadius: "14px",
  padding: "16px",
  marginBottom: "16px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const cardTitle = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "14px",
};

const fieldLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#555",
  marginBottom: "4px",
  display: "block",
};

const dropdownStyle = {
  width: "100%",
  height: "38px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  padding: "0 10px",
  cursor: "pointer",
  boxSizing: "border-box",
};

const inputStyle = {
  ...styles.input,
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "14px",
  height: "38px",
};

export default function SignUpPageTwo({ goBack, goNext, onComplete }) {
  const [major, setMajor] = useState(MAJORS[0]);

  const [classes, setClasses] = useState([
    { name: "", day: "", hour: "9:00", period: "AM" },
    { name: "", day: "", hour: "9:00", period: "AM" },
    { name: "", day: "", hour: "9:00", period: "AM" },
    { name: "", day: "", hour: "9:00", period: "AM" },
  ]);

  const [locations, setLocations] = useState([
    { selection: "", custom: "" },
    { selection: "", custom: "" },
    { selection: "", custom: "" },
  ]);

  const [methods, setMethods] = useState([
    { selection: "", custom: "" },
    { selection: "", custom: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateClass = (idx, field, value) =>
    setClasses(prev => { const n = [...prev]; n[idx] = { ...n[idx], [field]: value }; return n; });

  const updateLocation = (idx, field, value) =>
    setLocations(prev => { const n = [...prev]; n[idx] = { ...n[idx], [field]: value }; return n; });

  const updateMethod = (idx, field, value) =>
    setMethods(prev => { const n = [...prev]; n[idx] = { ...n[idx], [field]: value }; return n; });

  async function finishSignup() {
    const token = localStorage.getItem("token");
    setError("");
    setSaving(true);

    const filledClasses = classes.filter(c => c.name.trim()).map((c, i) => ({
      id: Date.now() + i,
      name: c.name.trim(),
      day: c.day || "",
      time: `${c.hour} ${c.period}`,
    }));

    const filledLocations = locations
      .map(l => (l.selection === "Other" ? l.custom : l.selection))
      .filter(l => l && l.trim());

    const filledMethods = methods
      .map(m => (m.selection === "Other" ? m.custom : m.selection))
      .filter(m => m && m.trim());

    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ major }),
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
      {/* Top row */}
      <div style={styles.topRow}><BackButton onClick={goBack} /></div>

      {/* Title */}
      <h2 style={{ fontSize: "22px", fontWeight: "800", textAlign: "center", color: "#222", marginBottom: "4px" }}>
        Set Up Your Profile
      </h2>
      <p style={{ fontSize: "13px", color: "#888", textAlign: "center", marginBottom: "6px" }}>
        Tell us about your studies so we can find your best matches.
      </p>

      {/* Step indicator */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        <div style={{ width: 28, height: 6, borderRadius: 3, backgroundColor: "#ccc" }} />
        <div style={{ width: 28, height: 6, borderRadius: 3, backgroundColor: "#0c0c0c" }} />
      </div>

      {error && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: 10, marginBottom: 14, textAlign: "center", fontSize: "13px" }}>
          ❌ {error}
        </div>
      )}

      {/* ── ACADEMIC INFO ── */}
      <div style={card}>
        <div style={cardTitle}>🎓 Academic Info</div>
        <label style={fieldLabel}>Your Major</label>
        <select style={dropdownStyle} value={major} onChange={(e) => setMajor(e.target.value)}>
          {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* ── CLASSES ── */}
      <div style={card}>
        <div style={cardTitle}>📚 Your Classes</div>
        <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px", marginTop: "-8px" }}>
          Add up to 4 classes with their times.
        </p>
        {classes.map((c, idx) => (
          <div key={idx} style={{ marginBottom: idx < 3 ? "16px" : 0 }}>
            <label style={fieldLabel}>Class {idx + 1}</label>
            {/* Class name */}
            <input
              type="text"
              style={{ ...inputStyle, width: "100%", marginBottom: "6px" }}
              value={c.name}
              onChange={(e) => updateClass(idx, "name", e.target.value)}
              placeholder="Class name"
            />
            {/* Day + Time row */}
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <div style={{ flex: 2 }}>
                <label style={{ ...fieldLabel, fontSize: 11, color: "#aaa" }}>📅 Day</label>
                <select
                  value={c.day}
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
                <label style={{ ...fieldLabel, fontSize: 11, color: "#aaa" }}>🕐 Time</label>
                <select
                  value={c.hour}
                  onChange={(e) => updateClass(idx, "hour", e.target.value)}
                  style={{ ...dropdownStyle, width: "100%" }}
                >
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div style={{ flex: "0 0 64px" }}>
                <label style={{ ...fieldLabel, fontSize: 11, color: "#aaa" }}>AM/PM</label>
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
          </div>
        ))}
      </div>

      {/* ── STUDY LOCATIONS ── */}
      <div style={card}>
        <div style={cardTitle}>📍 Preferred Study Locations</div>
        <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px", marginTop: "-8px" }}>
          Where do you like to study?
        </p>
        {locations.map((loc, idx) => (
          <div key={idx} style={{ marginBottom: idx < locations.length - 1 ? "12px" : 0 }}>
            <label style={fieldLabel}>Location {idx + 1}</label>
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
                style={{ ...inputStyle, marginTop: "8px" }}
                placeholder="Enter custom location"
                value={loc.custom}
                onChange={(e) => updateLocation(idx, "custom", e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── STUDY METHODS ── */}
      <div style={card}>
        <div style={cardTitle}>💡 Preferred Study Methods</div>
        <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px", marginTop: "-8px" }}>
          How do you study best?
        </p>
        {methods.map((meth, idx) => (
          <div key={idx} style={{ marginBottom: idx < methods.length - 1 ? "12px" : 0 }}>
            <label style={fieldLabel}>Method {idx + 1}</label>
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
                style={{ ...inputStyle, marginTop: "8px" }}
                placeholder="Enter custom method"
                value={meth.custom}
                onChange={(e) => updateMethod(idx, "custom", e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Finish button */}
      <button
        style={{
          ...styles.mainButton,
          backgroundColor: saving ? "#aaa" : "#4CAF50",
          borderRadius: "10px",
          fontWeight: "700",
          fontSize: "15px",
          cursor: saving ? "not-allowed" : "pointer",
          marginTop: "8px",
          marginBottom: "30px",
        }}
        onClick={finishSignup}
        disabled={saving}
      >
        {saving ? "SAVING…" : "FINISH CREATING ACCOUNT →"}
      </button>
    </div>
  );
}

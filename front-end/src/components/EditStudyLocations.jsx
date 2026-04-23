import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import { styles } from "../styles";

const checkboxContainer = {
  display: "flex",
  alignItems: "center",
  marginBottom: "12px",
  padding: "12px",
  backgroundColor: "white",
  border: "2px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
};

const checkboxBase = {
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  backgroundColor: "transparent",
  border: "2px solid #4CAF50",
  marginRight: "12px",
  flexShrink: 0,
};

const PREDEFINED = [
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
];

// Edit Study Locations – loads from GET /api/users/me, saves via PUT /api/users/me/locations
export default function EditStudyLocations({ goBack }) {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [customLocation, setCustomLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Load user's current preferred locations
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.preferredLocations)) {
          setSelectedLocations(data.preferredLocations);
        }
      })
      .catch(() => {});
  }, []);

  const toggle = (loc) =>
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );

  const addCustom = () => {
    const trimmed = customLocation.trim();
    if (trimmed && !selectedLocations.includes(trimmed)) {
      setSelectedLocations((prev) => [...prev, trimmed]);
      setCustomLocation("");
    }
  };

  const removeCustom = (loc) => {
    if (!PREDEFINED.includes(loc)) {
      setSelectedLocations((prev) => prev.filter((l) => l !== loc));
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    setStatus(null);
    fetch("/api/users/me/locations", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ locations: selectedLocations }),
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
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: "#555" }}>
        EDIT PREFERRED STUDY LOCATIONS
      </h2>

      <div style={{ marginBottom: "30px", fontSize: "14px", color: "#666", textAlign: "center", lineHeight: "1.6" }}>
        Select your preferred study locations. You can choose multiple options.
      </div>

      {status === "saved" && (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Locations saved!
        </div>
      )}
      {status === "error" && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Failed to save. Please try again.
        </div>
      )}

      {/* Predefined Locations */}
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.label}>Select from popular locations:</div>
        {PREDEFINED.map((location) => {
          const checked = selectedLocations.includes(location);
          return (
            <div
              key={location}
              style={{
                ...checkboxContainer,
                backgroundColor: checked ? "#f0f0f0" : "white",
                border: `2px solid ${checked ? "#4CAF50" : "#ddd"}`,
              }}
              onClick={() => toggle(location)}
            >
              <div style={{ ...checkboxBase, ...(checked ? { backgroundColor: "#4CAF50" } : {}) }} />
              <span style={{ fontSize: "14px", fontWeight: checked ? "bold" : "normal" }}>
                {location}
              </span>
            </div>
          );
        })}
      </div>

      {/* Custom Location Input */}
      <div style={styles.formGroup}>
        <div style={styles.label}>Or type a custom location:</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="Enter custom location"
            style={styles.input}
          />
          <button
            onClick={addCustom}
            style={{
              padding: "8px 12px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Custom (non-predefined) selected locations */}
      {selectedLocations.filter((loc) => !PREDEFINED.includes(loc)).length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={styles.label}>Your custom locations:</div>
          {selectedLocations
            .filter((loc) => !PREDEFINED.includes(loc))
            .map((location) => (
              <div
                key={location}
                style={{ ...checkboxContainer, backgroundColor: "#f0f0f0", border: "2px solid #4CAF50" }}
              >
                <div style={{ ...checkboxBase, backgroundColor: "#4CAF50" }} />
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>{location}</span>
                <button
                  onClick={() => removeCustom(location)}
                  style={{
                    marginLeft: "auto",
                    padding: "4px 8px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          ...styles.mainButton,
          backgroundColor: saving ? "#aaa" : "#4CAF50",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "SAVING…" : "SAVE STUDY LOCATIONS"}
      </button>
    </div>
  );
}

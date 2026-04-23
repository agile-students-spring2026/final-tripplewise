import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import { styles } from "../styles";

const LOCATION_OPTIONS = [
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
  "Other",
];

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
  width: "100%",
  boxSizing: "border-box",
};

const fieldLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#555",
  marginBottom: "4px",
  display: "block",
};

// Edit Study Locations – loads from GET /api/users/me, saves via PUT /api/users/me/locations
export default function EditStudyLocations({ goBack }) {
  const [locations, setLocations] = useState([
    { selection: "", custom: "" },
    { selection: "", custom: "" },
    { selection: "", custom: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Load user's current preferred locations on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.preferredLocations) && data.preferredLocations.length > 0) {
          // Map saved strings back into { selection, custom } objects
          const loaded = data.preferredLocations.map((loc) => {
            if (LOCATION_OPTIONS.includes(loc)) {
              return { selection: loc, custom: "" };
            } else {
              // It's a custom location
              return { selection: "Other", custom: loc };
            }
          });
          // Pad to at least 3 rows
          while (loaded.length < 3) loaded.push({ selection: "", custom: "" });
          setLocations(loaded);
        }
      })
      .catch(() => {});
  }, []);

  const updateLocation = (idx, field, value) =>
    setLocations((prev) => {
      const n = [...prev];
      n[idx] = { ...n[idx], [field]: value };
      return n;
    });

  const addRow = () =>
    setLocations((prev) => [...prev, { selection: "", custom: "" }]);

  const removeRow = (idx) =>
    setLocations((prev) => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    setStatus(null);

    const filledLocations = locations
      .map((l) => (l.selection === "Other" ? l.custom.trim() : l.selection))
      .filter((l) => l && l.trim());

    fetch("/api/users/me/locations", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ locations: filledLocations }),
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

      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "6px", textAlign: "center", color: "#555" }}>
        EDIT STUDY LOCATIONS
      </h2>
      <p style={{ fontSize: "13px", color: "#888", textAlign: "center", marginBottom: "20px" }}>
        Where do you like to study? Select up to 3 locations.
      </p>

      {status === "saved" && (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px", borderRadius: 8, marginBottom: 12, textAlign: "center" }}>
          ✅ Locations saved!
        </div>
      )}
      {status === "error" && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: 8, marginBottom: 12, textAlign: "center" }}>
          ❌ Failed to save. Please try again.
        </div>
      )}

      {/* Location rows */}
      <div style={{ backgroundColor: "white", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 16 }}>
        {locations.map((loc, idx) => (
          <div key={idx} style={{ marginBottom: idx < locations.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <label style={fieldLabel}>📍 Location {idx + 1}</label>
              {locations.length > 1 && (
                <button
                  onClick={() => removeRow(idx)}
                  style={{ background: "none", border: "none", color: "#f44336", cursor: "pointer", fontSize: 12, fontWeight: "bold" }}
                >
                  Remove
                </button>
              )}
            </div>
            <select
              value={loc.selection}
              onChange={(e) => updateLocation(idx, "selection", e.target.value)}
              style={dropdownStyle}
            >
              <option value="">Select a location</option>
              {LOCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {loc.selection === "Other" && (
              <input
                type="text"
                placeholder="Enter custom location"
                value={loc.custom}
                onChange={(e) => updateLocation(idx, "custom", e.target.value)}
                style={{ ...inputStyle, marginTop: 8 }}
              />
            )}
          </div>
        ))}

        {/* Add another location */}
        {locations.length < 6 && (
          <button
            onClick={addRow}
            style={{
              marginTop: 14,
              width: "100%",
              padding: "10px",
              background: "#f1f1f1",
              border: "1px dashed #ccc",
              borderRadius: 10,
              cursor: "pointer",
              color: "#555",
              fontSize: 13,
            }}
          >
            + Add another location
          </button>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          ...styles.mainButton,
          backgroundColor: saving ? "#aaa" : "#4CAF50",
          borderRadius: 10,
          fontSize: "15px",
          fontWeight: "bold",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "SAVING…" : "SAVE STUDY LOCATIONS"}
      </button>
    </div>
  );
}

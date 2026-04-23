import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import { styles } from "../styles";

const PREDEFINED = [
  "Flashcards",
  "Group Study",
  "Solo Study",
  "Teaching Others",
  "Practice Problems",
  "Mind Mapping",
  "Summarization",
  "Pomodoro Technique",
  "Active Recall",
  "Spaced Repetition",
  "Visual Learning",
  "Auditory Learning",
  "Reading Aloud",
  "Note Taking",
];

const dropdownStyle = {
  width: "100%",
  height: "40px",
  borderRadius: "8px",
  border: "1px solid black",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  padding: "0 10px",
  cursor: "pointer",
};

// Edit Study Methods – loads from GET /api/users/me, saves via PUT /api/users/me/methods
export default function EditStudyMethods({ goBack }) {
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const [customMethod, setCustomMethod] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Load user's current preferred methods from DB
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.preferredMethods)) {
          setSelectedMethods(data.preferredMethods);
        }
      })
      .catch(() => {});
  }, []);

  // Add method from dropdown
  const addFromDropdown = () => {
    if (dropdownValue && !selectedMethods.includes(dropdownValue)) {
      setSelectedMethods((prev) => [...prev, dropdownValue]);
      setDropdownValue("");
    }
  };

  // Add custom method
  const addCustom = () => {
    const trimmed = customMethod.trim();
    if (trimmed && !selectedMethods.includes(trimmed)) {
      setSelectedMethods((prev) => [...prev, trimmed]);
      setCustomMethod("");
    }
  };

  // Remove any method
  const removeMethod = (method) => {
    setSelectedMethods((prev) => prev.filter((m) => m !== method));
  };

  // Save to DB
  const handleSave = () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    setStatus(null);
    fetch("/api/users/me/methods", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ methods: selectedMethods }),
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
        EDIT PREFERRED STUDY METHODS
      </h2>

      <div style={{ marginBottom: "20px", fontSize: "14px", color: "#666", textAlign: "center", lineHeight: "1.6" }}>
        Select your preferred study methods from the dropdown. You can add multiple.
      </div>

      {status === "saved" && (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Methods saved!
        </div>
      )}
      {status === "error" && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Failed to save. Please try again.
        </div>
      )}

      {/* Dropdown selector */}
      <div style={styles.formGroup}>
        <div style={styles.label}>Select a study method:</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
            style={{ ...dropdownStyle, flex: 1 }}
          >
            <option value="">-- Choose a method --</option>
            {PREDEFINED.filter((m) => !selectedMethods.includes(m)).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button
            onClick={addFromDropdown}
            disabled={!dropdownValue}
            style={{
              padding: "8px 14px",
              backgroundColor: dropdownValue ? "#4CAF50" : "#aaa",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: dropdownValue ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Custom method input */}
      <div style={styles.formGroup}>
        <div style={styles.label}>Or type a custom study method:</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={customMethod}
            onChange={(e) => setCustomMethod(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            placeholder="Enter custom study method"
            style={styles.input}
          />
          <button
            onClick={addCustom}
            style={{
              padding: "8px 14px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected methods as removable tags */}
      {selectedMethods.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={styles.label}>Your selected methods:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
            {selectedMethods.map((method) => (
              <div
                key={method}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                <span>{method}</span>
                <button
                  onClick={() => removeMethod(method)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px",
                    lineHeight: "1",
                    padding: "0",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMethods.length === 0 && (
        <div style={{ padding: "16px", border: "1px dashed #ccc", borderRadius: "8px", textAlign: "center", color: "#999", marginBottom: "20px", fontSize: "13px" }}>
          No methods selected yet. Use the dropdown above to add some.
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
        {saving ? "SAVING…" : "SAVE STUDY METHODS"}
      </button>
    </div>
  );
}

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

// Edit Study Methods – loads from GET /api/users/me, saves via PUT /api/users/me/methods
export default function EditStudyMethods({ goBack }) {
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [customMethod, setCustomMethod] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Load user's current preferred methods
  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.preferredMethods)) {
          setSelectedMethods(data.preferredMethods);
        }
      })
      .catch(() => {});
  }, []);

  const toggle = (method) =>
    setSelectedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );

  const addCustom = () => {
    const trimmed = customMethod.trim();
    if (trimmed && !selectedMethods.includes(trimmed)) {
      setSelectedMethods((prev) => [...prev, trimmed]);
      setCustomMethod("");
    }
  };

  const removeCustom = (method) => {
    if (!PREDEFINED.includes(method)) {
      setSelectedMethods((prev) => prev.filter((m) => m !== method));
    }
  };

  const handleSave = () => {
    setSaving(true);
    setStatus(null);
    fetch("/api/users/me/methods", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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

      <div style={{ marginBottom: "30px", fontSize: "14px", color: "#666", textAlign: "center", lineHeight: "1.6" }}>
        Select your preferred study methods. You can choose multiple options.
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

      {/* Predefined Methods */}
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.label}>Select from popular study methods:</div>
        {PREDEFINED.map((method) => {
          const checked = selectedMethods.includes(method);
          return (
            <div
              key={method}
              style={{
                ...checkboxContainer,
                backgroundColor: checked ? "#f0f0f0" : "white",
                border: `2px solid ${checked ? "#4CAF50" : "#ddd"}`,
              }}
              onClick={() => toggle(method)}
            >
              <div style={{ ...checkboxBase, ...(checked ? { backgroundColor: "#4CAF50" } : {}) }} />
              <span style={{ fontSize: "14px", fontWeight: checked ? "bold" : "normal" }}>
                {method}
              </span>
            </div>
          );
        })}
      </div>

      {/* Custom Method Input */}
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

      {/* Custom (non-predefined) selected methods */}
      {selectedMethods.filter((m) => !PREDEFINED.includes(m)).length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={styles.label}>Your custom study methods:</div>
          {selectedMethods
            .filter((m) => !PREDEFINED.includes(m))
            .map((method) => (
              <div
                key={method}
                style={{ ...checkboxContainer, backgroundColor: "#f0f0f0", border: "2px solid #4CAF50" }}
              >
                <div style={{ ...checkboxBase, backgroundColor: "#4CAF50" }} />
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>{method}</span>
                <button
                  onClick={() => removeCustom(method)}
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
        {saving ? "SAVING…" : "SAVE STUDY METHODS"}
      </button>
    </div>
  );
}

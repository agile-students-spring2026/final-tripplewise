import BackButton from "./BackButton";
import { useState } from "react";
import { styles } from "../styles";

const customStyles = {
  ...styles,
  dropdown: {
    width: "100%",
    height: "34px",
    borderRadius: "12px",
    border: "1px solid black",
    padding: "8px",
    boxSizing: "border-box",
    backgroundColor: "white",
    fontSize: "14px"
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "white",
    border: "2px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer"
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    backgroundColor: "transparent",
    border: "2px solid #4CAF50",
    marginRight: "12px"
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50"
  },
  methodItem: {
    fontSize: "14px",
    fontWeight: "normal"
  },
  methodItemChecked: {
    fontWeight: "bold"
  }
};

export default function EditStudyMethods({ goBack }) {
  const [selectedMethods, setSelectedMethods] = useState([
    "Flashcards",
    "Group Study"
  ]);
  const [customMethod, setCustomMethod] = useState("");

  const studyMethods = [
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
    "Note Taking"
  ];

  const handleMethodToggle = (method) => {
    setSelectedMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleAddCustomMethod = () => {
    if (customMethod.trim() && !selectedMethods.includes(customMethod.trim())) {
      setSelectedMethods(prev => [...prev, customMethod.trim()]);
      setCustomMethod("");
    }
  };

  const handleRemoveCustomMethod = (method) => {
    if (!studyMethods.includes(method)) {
      setSelectedMethods(prev => prev.filter(m => m !== method));
    }
  };

  const handleSave = () => {
    console.log("Saved study methods:", selectedMethods);
    // TODO: Save to backend API
    goBack();
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2 style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
        color: "#555"
      }}>
        EDIT PREFERRED STUDY METHODS
      </h2>

      <div style={{
        marginBottom: "30px",
        fontSize: "14px",
        color: "#666",
        textAlign: "center",
        lineHeight: "1.6"
      }}>
        Select your preferred study methods. You can choose multiple options.
      </div>

      {/* Predefined Methods */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={styles.label}>Select from popular study methods:</div>
        {studyMethods.map((method, index) => (
          <div
            key={index}
            style={{
              ...customStyles.checkboxContainer,
              backgroundColor: selectedMethods.includes(method) ? "#f0f0f0" : "white",
              border: "2px solid " + (selectedMethods.includes(method) ? "#4CAF50" : "#ddd")
            }}
            onClick={() => handleMethodToggle(method)}
          >
            <div style={{
              ...customStyles.checkbox,
              ...(selectedMethods.includes(method) ? customStyles.checkboxChecked : {})
            }}></div>
            <span style={{
              ...customStyles.methodItem,
              ...(selectedMethods.includes(method) ? customStyles.methodItemChecked : {})
            }}>
              {method}
            </span>
          </div>
        ))}
      </div>

      {/* Custom Method Input */}
      <div style={styles.formGroup}>
        <div style={styles.label}>Add custom study method:</div>
        <div style={{
          display: "flex",
          gap: "8px"
        }}>
          <select style={customStyles.dropdown}>
            <option value="">Select a method...</option>
            {studyMethods.map((method, index) => (
              <option key={index} value={method}>{method}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const selected = document.querySelector('select').value;
              if (selected && !selectedMethods.includes(selected)) {
                setSelectedMethods(prev => [...prev, selected]);
              }
            }}
            style={{
              padding: "8px 12px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div style={styles.formGroup}>
        <div style={styles.label}>Or type custom study method:</div>
        <div style={{
          display: "flex",
          gap: "8px"
        }}>
          <input
            type="text"
            value={customMethod}
            onChange={(e) => setCustomMethod(e.target.value)}
            placeholder="Enter custom study method"
            style={styles.input}
          />
          <button
            onClick={handleAddCustomMethod}
            style={{
              padding: "8px 12px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold"
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Custom Methods */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={styles.label}>Your custom study methods:</div>
        {selectedMethods.filter(method => !studyMethods.includes(method)).map((method, index) => (
          <div
            key={`custom-${index}`}
            style={{
              ...customStyles.checkboxContainer,
              backgroundColor: "#f0f0f0",
              border: "2px solid #4CAF50"
            }}
          >
            <div style={{
              ...customStyles.checkbox,
              ...customStyles.checkboxChecked
            }}></div>
            <span style={{
              ...customStyles.methodItem,
              ...customStyles.methodItemChecked
            }}>
              {method}
            </span>
            <button
              onClick={() => handleRemoveCustomMethod(method)}
              style={{
                marginLeft: "auto",
                padding: "4px 8px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px"
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          ...styles.mainButton,
          backgroundColor: "#4CAF50",
          fontSize: "16px",
          fontWeight: "bold"
        }}
      >
        SAVE STUDY METHODS
      </button>
    </div>
  );
}
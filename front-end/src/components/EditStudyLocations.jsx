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
  locationItem: {
    fontSize: "14px",
    fontWeight: "normal"
  },
  locationItemChecked: {
    fontWeight: "bold"
  }
};

export default function EditStudyLocations({ goBack }) {
  const [selectedLocations, setSelectedLocations] = useState([
    "Bobst Library",
    "Courant Institute"
  ]);
  const [customLocation, setCustomLocation] = useState("");

  const studyLocations = [
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
    "NYU Abu Dhabi"
  ];

  const handleLocationToggle = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleAddCustomLocation = () => {
    if (customLocation.trim() && !selectedLocations.includes(customLocation.trim())) {
      setSelectedLocations(prev => [...prev, customLocation.trim()]);
      setCustomLocation("");
    }
  };

  const handleRemoveCustomLocation = (location) => {
    if (!studyLocations.includes(location)) {
      setSelectedLocations(prev => prev.filter(l => l !== location));
    }
  };

  const handleSave = () => {
    console.log("Saved study locations:", selectedLocations);
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
        EDIT PREFERRED STUDY LOCATIONS
      </h2>

      <div style={{
        marginBottom: "30px",
        fontSize: "14px",
        color: "#666",
        textAlign: "center",
        lineHeight: "1.6"
      }}>
        Select your preferred study locations. You can choose multiple options.
      </div>

      {/* Predefined Locations */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={styles.label}>Select from popular locations:</div>
        {studyLocations.map((location, index) => (
          <div
            key={index}
            style={{
              ...customStyles.checkboxContainer,
              backgroundColor: selectedLocations.includes(location) ? "#f0f0f0" : "white",
              border: "2px solid " + (selectedLocations.includes(location) ? "#4CAF50" : "#ddd")
            }}
            onClick={() => handleLocationToggle(location)}
          >
            <div style={{
              ...customStyles.checkbox,
              ...(selectedLocations.includes(location) ? customStyles.checkboxChecked : {})
            }}></div>
            <span style={{
              ...customStyles.locationItem,
              ...(selectedLocations.includes(location) ? customStyles.locationItemChecked : {})
            }}>
              {location}
            </span>
          </div>
        ))}
      </div>

      {/* Custom Location Input */}
      <div style={styles.formGroup}>
        <div style={styles.label}>Add custom location:</div>
        <div style={{
          display: "flex",
          gap: "8px"
        }}>
          <select style={customStyles.dropdown}>
            <option value="">Select a location...</option>
            {studyLocations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
          <button
            onClick={() => {
              const selected = document.querySelector('select').value;
              if (selected && !selectedLocations.includes(selected)) {
                setSelectedLocations(prev => [...prev, selected]);
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
        <div style={styles.label}>Or type custom location:</div>
        <div style={{
          display: "flex",
          gap: "8px"
        }}>
          <input
            type="text"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder="Enter custom location"
            style={styles.input}
          />
          <button
            onClick={handleAddCustomLocation}
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

      {/* Selected Custom Locations */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={styles.label}>Your custom locations:</div>
        {selectedLocations.filter(loc => !studyLocations.includes(loc)).map((location, index) => (
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
              ...customStyles.locationItem,
              ...customStyles.locationItemChecked
            }}>
              {location}
            </span>
            <button
              onClick={() => handleRemoveCustomLocation(location)}
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
        SAVE STUDY LOCATIONS
      </button>
    </div>
  );
}
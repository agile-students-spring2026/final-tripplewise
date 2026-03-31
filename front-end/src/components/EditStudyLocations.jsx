import BackButton from "./BackButton";
import { useState } from "react";
import { styles } from "../styles";
// allow users to edit their preferred study locations in the dashboard settings page
export default function EditStudyLocations({ goBack }) {
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [location3, setLocation3] = useState("");

  const handleSave = () => {
    console.log("Saved study locations:", { location1, location2, location3 });
    goBack();
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "8px",
    letterSpacing: "0.05em",
    fontFamily: "serif",
    color: "black",
  };

  const inputStyle = {
    width: "100%",
    height: "36px",
    border: "1px solid black",
    backgroundColor: "white",
    padding: "6px 10px",
    boxSizing: "border-box",
    fontSize: "14px",
    borderRadius: "0",
    color: "black",
    outline: "none",
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "28px",
          letterSpacing: "0.05em",
          fontFamily: "serif",
          color: "black",
        }}
      >
        Edit Preferred Study Locations
      </h2>

      {/* Location 1 */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Edit Preferred Study Location 1:</label>
        <input
          type="text"
          value={location1}
          onChange={(e) => setLocation1(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Location 2 */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Edit Preferred Study Location 2:</label>
        <input
          type="text"
          value={location2}
          onChange={(e) => setLocation2(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Location 3 */}
      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Edit Preferred Study Location 3:</label>
        <input
          type="text"
          value={location3}
          onChange={(e) => setLocation3(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Save Changes Button */}
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          backgroundColor: "black",
          color: "white",
          border: "none",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          letterSpacing: "0.08em",
          fontFamily: "serif",
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

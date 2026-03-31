import BackButton from "./BackButton";
import { useState } from "react";
import { styles } from "../styles";

export default function EditStudyMethods({ goBack }) {
  const [method1, setMethod1] = useState("");
  const [method2, setMethod2] = useState("");

  const handleSave = () => {
    console.log("Saved study methods:", { method1, method2 });
    // TODO: Save to backend API
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
        Edit Preferred Study Methods
      </h2>

      {/* Method 1 */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Edit Preferred Study Method 1:</label>
        <input
          type="text"
          value={method1}
          onChange={(e) => setMethod1(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Method 2 */}
      <div style={{ marginBottom: "32px" }}>
        <label style={labelStyle}>Edit Preferred Study Method 2:</label>
        <input
          type="text"
          value={method2}
          onChange={(e) => setMethod2(e.target.value)}
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

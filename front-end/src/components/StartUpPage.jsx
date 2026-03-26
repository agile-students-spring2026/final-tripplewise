import React from "react";
import { styles } from "../styles";

export default function StartUpPage({ onLogin, onSignUp }) {
  return (
    <div style={styles.page}>
      {/* App Title */}
      <h1 style={{ ...styles.bigTitle, textAlign: "center", marginTop: "40px" }}>
        Study Sync
      </h1>

      {/* Welcome Graphic Placeholder */}
      <div 
        style={{
          width: "90%",
          height: "40%", 
          backgroundColor: "#e0e0e0", 
          margin: "40px auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "20px",
          border: "2px dashed #ccc"
        }}
      >
        <span style={{ color: "#888" }}>[ Welcome Graphic Placeholder ]</span>
      </div>

      {/* Button Container */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        justifyContent: "center", 
        width: "100%",
        padding: "0 20px" 
      }}>
        <button 
          style={{ ...styles.mainButton, flex: 1 }} 
          onClick={onLogin}
        >
          LOGIN
        </button>
        <button 
          style={{ ...styles.mainButton, flex: 1 }} 
          onClick={onSignUp}
        >
          SIGN UP
        </button>
      </div>

      {/* Footer Copyright */}
      <footer style={{ 
        position: "absolute", 
        bottom: "30px", 
        width: "100%", 
        textAlign: "center",
        fontSize: "0.8rem",
        color: "#666"
      }}>
        © 2026 [Team Triplewise]
      </footer>
    </div>
  );
}
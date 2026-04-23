import React from "react";
import { styles } from "../styles";

export default function StartUpPage({ onLogin, onSignUp }) {
  return (
    <div style={styles.page}>
      <h1 style={styles.bigTitle}>Study Sync</h1>

      {/* The Welcome Graphic Box */}
      <div style={styles.illustrationPlaceholder}>
        <span style={{ color: "#888", fontWeight: "600" }}>
          [ Welcome Graphic ]
        </span>
        <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "8px" }}>
          Illustration Space
        </p>
      </div>

      <div style={{ width: "100%", padding: "0 6px", boxSizing: "border-box" }}>
        <button 
          style={styles.mainButton} 
          onClick={onLogin}
          onMouseOver={(e) => e.target.style.opacity = "0.9"}
          onMouseOut={(e) => e.target.style.opacity = "1"}
        >
          LOGIN
        </button>
        
        <button 
          style={styles.secondaryButton} 
          onClick={onSignUp}
          onMouseOver={(e) => e.target.style.opacity = "1"}
          onMouseOut={(e) => e.target.style.opacity = "0.85"}
        >
          SIGN UP
        </button>
      </div>

      <footer style={styles.footer}>
        © 2026 [Team Triplewise]
      </footer>
    </div>
  );
}
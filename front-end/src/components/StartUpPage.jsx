import React from "react";
import { styles } from "../styles";

export default function StartUpPage({ onLogin, onSignUp }) {
  return (
    <div style={styles.page}>
      <h1 style={{
        ...styles.bigTitle,
        fontFamily: "'Playfair Display', serif",
        fontStyle: "italic",
        color: "#08060d",
        fontSize: "44px",
        letterSpacing: "-1px",
      }}>
        Study Sync
      </h1>

      {/* The Welcome Graphic */}
      <div style={{
        width: "100%",
        borderRadius: "16px",
        marginBottom: "20px",
        overflow: "hidden",
        backgroundColor: "white",
      }}>
        <img
          src="/welcome-graphic.png"
          alt="Welcome to Study Sync"
          style={{
            width: "100%",
            display: "block",
          }}
        />
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

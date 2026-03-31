import React from "react";
import { styles } from "../styles";

export default function StartUpPage({ onLogin, onSignUp }) {
  return (
    <div style={{ 
      ...styles.page, 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      height: "100%",
      position: "relative",
      boxSizing: "border-box" 
    }}>
      
      {/* App Title */}
      <h1 style={{ 
        ...styles.bigTitle, 
        textAlign: "center", 
        marginTop: "30px",
        marginBottom: "10px" 
      }}>
        Study Sync
      </h1>

      {/* Welcome Graphic Placeholder - Now 50% Height */}
      <div 
        style={{
          width: "90%",
          height: "50%", 
          minHeight: "350px",
          backgroundColor: "#f5f5f5", 
          margin: "10px auto 30px auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "24px",
          border: "2px dashed #bbb",
          boxSizing: "border-box"
        }}
      >
        <span style={{ color: "#888", fontWeight: "600" }}>
          [ Welcome Graphic ]
        </span>
        <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "8px" }}>
          Illustration Space
        </p>
      </div>

      {/* Button Container - Vertically Stacked */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "15px", 
        width: "100%",
        padding: "0 30px",
        boxSizing: "border-box"
      }}>
        <button 
          style={{ 
            ...styles.mainButton, 
            width: "100%", 
            padding: "15px 0", // Making it a bit taller for easier tapping
            fontSize: "1rem",
            fontWeight: "bold"
          }} 
          onClick={onLogin}
        >
          LOGIN
        </button>
        
        <button 
          style={{ 
            ...styles.mainButton, 
            width: "100%", 
            padding: "15px 0",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#fff", // Optional: outline style for secondary button
            color: "#333",
            border: "2px solid #333" 
          }} 
          onClick={onSignUp}
        >
          SIGN UP
        </button>
      </div>

      {/* Footer Copyright */}
      <footer style={{ 
        marginTop: "auto", // Pushes footer to the very bottom
        paddingBottom: "20px",
        width: "100%", 
        textAlign: "center",
        fontSize: "0.75rem",
        color: "#999"
      }}>
        © 2026 [Team Triplewise]
      </footer>
    </div>
  );
}
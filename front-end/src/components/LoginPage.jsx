
import React from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

export default function LoginPage({ goBack, onLogin }) {
  return (
    <div style={styles.page}>
      {/* Top row with Back Button */}
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      {/* Header Section */}
      <h1 style={styles.bigTitle}>Login</h1>
      <p style={{ ...styles.label, textAlign: "center", marginBottom: "30px" }}>
        Welcome back, enter your credentials below to login.
      </p>

      {/* Username Field */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Username</label>
        <input type="text" style={styles.input} />
      </div>

      {/* Password Field */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Password</label>
        <input type="password" style={styles.input} />
      </div>

      {/* Login Action */}
      <button 
        style={{ ...styles.mainButton, marginTop: "20px" }} 
        onClick={onLogin}
      >
        LOGIN
      </button>
    </div>
  );
}
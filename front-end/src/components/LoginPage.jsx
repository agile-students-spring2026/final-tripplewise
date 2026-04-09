import React, { useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

export default function LoginPage({ goBack, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    // connects to server to send username and password
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      console.log("Login success:", data);
      onLogin();
    } catch (err) {
      setError("Could not connect to backend");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h1 style={styles.bigTitle}>Login</h1>
      <p style={{ ...styles.label, textAlign: "center", marginBottom: "30px" }}>
        Welcome back, enter your credentials below to login.
      </p>

      <div style={styles.formGroup}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "12px" }}>
          {error}
        </p>
      )}

      <button
        style={{ ...styles.mainButton, marginTop: "20px" }}
        onClick={handleLogin}
      >
        LOGIN
      </button>
    </div>
  );
}
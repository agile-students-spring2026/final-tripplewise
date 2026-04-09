import { useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

export default function SignUpPageOne({ goNext, goBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup() {
    setError("");

    // connects to server to send username and password
    try {
      const response = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      console.log("Signup success:", data);
      goNext?.(username);
    } catch (err) {
      setError("Could not connect to backend");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h1 style={styles.bigTitle}>SIGN UP</h1>

      <div style={styles.stepsBox}>
        <p>1. Create an Account</p>
        <p>2. Add Your Schedule</p>
        <p>3. See Your Matches</p>
        <p>4. Partner Up, and Study!</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Enter a Username:</label>
        <input
          type="text"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Enter a Password:</label>
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

      <button style={styles.mainButton} onClick={handleSignup}>
        CREATE ACCOUNT
      </button>
    </div>
  );
}
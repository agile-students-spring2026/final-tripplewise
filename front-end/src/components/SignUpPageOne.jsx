import { useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

export default function SignUpPageOne({ goNext, goBack }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    username:  "",
    password:  "",
  });
  const [error, setError]   = useState("");
  const [saving, setSaving] = useState(false);
  const signupBg = saving ? "rgba(12,12,12,0.9)" : (styles.mainButton?.backgroundColor || "#0c0c0c");

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSignup() {
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username and password are required");
      return;
    }

    setSaving(true);
    try {
      // Step 1: create the account (username + password)
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok) {
        setError(signupData.message || "Signup failed");
        setSaving(false);
        return;
      }

      // Step 2: save personal details (firstName, lastName, email)
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName:  formData.lastName,
          email:     formData.email,
        }),
      });

      setSaving(false);
      goNext?.(formData.username);
    } catch (err) {
      setSaving(false);
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

      {/* Personal info */}
      <div style={styles.formGroup}>
        <label style={styles.label}>First Name:</label>
        <input
          type="text"
          style={styles.input}
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          placeholder="John"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Last Name:</label>
        <input
          type="text"
          style={styles.input}
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          placeholder="Doe"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email Address:</label>
        <input
          type="email"
          style={styles.input}
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="you@nyu.edu"
        />
      </div>

      {/* Account credentials */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Username:</label>
        <input
          type="text"
          style={styles.input}
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          placeholder="Choose a username"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Password:</label>
        <input
          type="password"
          style={styles.input}
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="Choose a password"
        />
      </div>

      {error && (
        <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>
      )}

      <button
        style={{
          ...styles.mainButton,
          backgroundColor: signupBg,
          cursor: saving ? "not-allowed" : "pointer",
        }}
        onClick={handleSignup}
        disabled={saving}
      >
        {saving ? "CREATING…" : "CREATE ACCOUNT"}
      </button>
    </div>
  );
}

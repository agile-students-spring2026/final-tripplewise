import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import { styles } from "../styles";

// Allow users to edit their account details via PATCH /api/users/me
export default function EditAccountDetails({ goBack, onLogout }) {
  const [formData, setFormData] = useState({
    username:  "",
    firstName: "",
    lastName:  "",
    email:     "",
    phone:     "",
    major:     "",
    year:      "Sophomore",
    bio:       "",
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // "saved" | "error"

  // Load current user data on mount
  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setFormData({
          username:  data.username  || "",
          firstName: data.firstName || "",
          lastName:  data.lastName  || "",
          email:     data.email     || "",
          phone:     data.phone     || "",
          major:     data.major     || "",
          year:      data.year      || "Sophomore",
          bio:       data.bio       || "",
        });
      })
      .catch(() => {});
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setStatus(null);
    fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then(() => {
        setSaving(false);
        setStatus("saved");
        setTimeout(() => goBack(), 800);
      })
      .catch(() => {
        setSaving(false);
        setStatus("error");
      });
  };

  const handleLogout = () => {
    if (typeof onLogout === "function") onLogout();
    else goBack();
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2 style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
        color: "#555",
      }}>
        EDIT ACCOUNT DETAILS
      </h2>

      <div style={{
        marginBottom: "20px",
        fontSize: "14px",
        color: "#666",
        textAlign: "center",
        lineHeight: "1.6",
      }}>
        Update your profile information below.
      </div>

      {/* Status banner */}
      {status === "saved" && (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Changes saved!
        </div>
      )}
      {status === "error" && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px", borderRadius: 6, marginBottom: 12, textAlign: "center" }}>
          Failed to save. Please try again.
        </div>
      )}

      {/* Account Credentials */}
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.label}>ACCOUNT</div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Username</div>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            style={styles.input}
            placeholder="Your username"
          />
        </div>
      </div>

      {/* Personal Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.label}>PERSONAL INFORMATION</div>

        <div style={styles.formGroup}>
          <div style={styles.label}>First Name</div>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            style={styles.input}
            placeholder="First name"
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Last Name</div>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            style={styles.input}
            placeholder="Last name"
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Email Address</div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            style={styles.input}
            placeholder="you@nyu.edu"
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Phone Number</div>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            style={styles.input}
            placeholder="(123) 456-7890"
          />
        </div>
      </div>

      {/* Academic Information */}
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.label}>ACADEMIC INFORMATION</div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Major</div>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => handleInputChange("major", e.target.value)}
            style={styles.input}
            placeholder="e.g. Computer Science"
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Year</div>
          <select
            value={formData.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            style={{
              ...styles.input,
              height: "34px",
              borderRadius: "12px",
              border: "1px solid black",
              backgroundColor: "white",
              color: "black",
              fontSize: "14px",
            }}
          >
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
      </div>

      {/* Bio */}
      <div style={{ marginBottom: "20px" }}>
        <div style={styles.label}>BIO</div>
        <div style={styles.formGroup}>
          <div style={styles.label}>Tell us about yourself</div>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            style={{ ...styles.input, height: "80px", resize: "vertical", padding: "8px" }}
            placeholder="Share your interests, study preferences, or anything else you'd like potential study partners to know..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            backgroundColor: saving ? "#aaa" : "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: saving ? "not-allowed" : "pointer",
            borderRadius: "8px",
          }}
        >
          {saving ? "SAVING…" : "SAVE CHANGES"}
        </button>

        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "12px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Delete Account Option */}
      <div style={{ borderTop: "1px solid #ddd", paddingTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              console.log("Delete account clicked");
              goBack();
            }
          }}
          style={{
            backgroundColor: "transparent",
            color: "#f44336",
            border: "2px solid #f44336",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
}

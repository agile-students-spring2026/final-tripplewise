import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import { styles } from "../styles";

const MAJORS = [
  "Computer Science",
  "Mathematics",
  "Art History",
  "Physics",
  "Electrical Engineering",
  "Finance",
  "Accounting",
];

const dropdownStyle = {
  width: "100%",
  height: "38px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  backgroundColor: "white",
  color: "black",
  fontSize: "14px",
  padding: "0 10px",
  cursor: "pointer",
  boxSizing: "border-box",
};

const inputStyle = {
  ...styles.input,
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "14px",
  height: "38px",
};

const sectionCard = {
  backgroundColor: "white",
  borderRadius: "14px",
  padding: "16px",
  marginBottom: "16px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: "14px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const fieldLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#555",
  marginBottom: "4px",
  display: "block",
};

const savedHint = {
  fontSize: "11px",
  color: "#aaa",
  marginTop: "3px",
  paddingLeft: "2px",
};

const notSetHint = {
  fontSize: "11px",
  color: "#ccc",
  marginTop: "3px",
  paddingLeft: "2px",
  fontStyle: "italic",
};

export default function EditAccountDetails({ goBack, onLogout }) {
  const [formData, setFormData] = useState({
    username:  "",
    firstName: "",
    lastName:  "",
    email:     "",
    phone:     "",
    major:     MAJORS[0],
    year:      "Sophomore",
    bio:       "",
  });
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // Password change state
  const [pwData, setPwData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwStatus, setPwStatus] = useState(null); // "saved" | "error" | string

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const loaded = {
          username:  data.username  || "",
          firstName: data.firstName || "",
          lastName:  data.lastName  || "",
          email:     data.email     || "",
          phone:     data.phone     || "",
          major:     data.major     || MAJORS[0],
          year:      data.year      || "Sophomore",
          bio:       data.bio       || "",
        };
        setFormData(loaded);
        setSavedData(loaded);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    setStatus(null);
    fetch("/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .then(() => {
        setSaving(false);
        setStatus("saved");
        setTimeout(() => goBack(), 900);
      })
      .catch(() => {
        setSaving(false);
        setStatus("error");
      });
  };

  const handlePasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = pwData;
    setPwStatus(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwStatus("All password fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setPwStatus("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus("New passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    setPwSaving(true);
    fetch("/api/users/me/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then((r) => r.json())
      .then((data) => {
        setPwSaving(false);
        if (data.success) {
          setPwStatus("saved");
          setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          setPwStatus(data.error || "Failed to update password");
        }
      })
      .catch(() => {
        setPwSaving(false);
        setPwStatus("Could not connect to server");
      });
  };

  const handleLogout = () => {
    if (typeof onLogout === "function") onLogout();
    else goBack();
  };

  // Helper: show saved hint
  const Hint = ({ field }) => {
    const val = savedData?.[field];
    if (val) return <div style={savedHint}>Saved: <strong>{val}</strong></div>;
    return <div style={notSetHint}>Not set yet</div>;
  };

  return (
    <div style={styles.page}>
      {/* Top row */}
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      {/* Title */}
      <h2 style={{ fontSize: "22px", fontWeight: "800", textAlign: "center", color: "#222", marginBottom: "4px" }}>
        Edit Account Details
      </h2>
      <p style={{ fontSize: "13px", color: "#888", textAlign: "center", marginBottom: "20px" }}>
        {loading ? "Loading your profile…" : "Your info is pre-filled. Edit and save."}
      </p>

      {/* Loading spinner */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#bbb", fontSize: "14px" }}>
          ⏳ Loading…
        </div>
      )}

      {/* Status banners */}
      {status === "saved" && (
        <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "10px 14px", borderRadius: 10, marginBottom: 14, textAlign: "center", fontSize: "14px", fontWeight: "600" }}>
          ✅ Changes saved!
        </div>
      )}
      {status === "error" && (
        <div style={{ background: "#ffebee", color: "#c62828", padding: "10px 14px", borderRadius: 10, marginBottom: 14, textAlign: "center", fontSize: "14px", fontWeight: "600" }}>
          ❌ Failed to save. Please try again.
        </div>
      )}

      {!loading && (
        <>
          {/* ── ACCOUNT ── */}
          <div style={sectionCard}>
            <div style={sectionTitle}>🔑 Account</div>

            <div style={{ marginBottom: "12px" }}>
              <label style={fieldLabel}>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                style={inputStyle}
                placeholder="Your username"
              />
              <Hint field="username" />
            </div>
          </div>

          {/* ── PERSONAL INFO ── */}
          <div style={sectionCard}>
            <div style={sectionTitle}>👤 Personal Information</div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={fieldLabel}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  style={inputStyle}
                  placeholder="First name"
                />
                <Hint field="firstName" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={fieldLabel}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  style={inputStyle}
                  placeholder="Last name"
                />
                <Hint field="lastName" />
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={fieldLabel}>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={inputStyle}
                placeholder="you@nyu.edu"
              />
              <Hint field="email" />
            </div>

            <div>
              <label style={fieldLabel}>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                style={inputStyle}
                placeholder="(123) 456-7890"
              />
              <Hint field="phone" />
            </div>
          </div>

          {/* ── ACADEMIC INFO ── */}
          <div style={sectionCard}>
            <div style={sectionTitle}>🎓 Academic Information</div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
              <div style={{ flex: 2 }}>
                <label style={fieldLabel}>Major</label>
                <select
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  style={dropdownStyle}
                >
                  {MAJORS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <Hint field="major" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={fieldLabel}>Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  style={dropdownStyle}
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
                <Hint field="year" />
              </div>
            </div>
          </div>

          {/* ── BIO ── */}
          <div style={sectionCard}>
            <div style={sectionTitle}>📝 Bio</div>
            <label style={fieldLabel}>Tell us about yourself</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              style={{
                ...inputStyle,
                height: "90px",
                resize: "vertical",
                padding: "10px",
                lineHeight: "1.5",
              }}
              placeholder="Share your interests, study preferences, or anything else you'd like potential study partners to know…"
            />
            <Hint field="bio" />
          </div>

          {/* ── CHANGE PASSWORD ── */}
          <div style={sectionCard}>
            <div style={sectionTitle}>🔒 Change Password</div>

            <div style={{ marginBottom: "12px" }}>
              <label style={fieldLabel}>Current Password</label>
              <input
                type="password"
                value={pwData.currentPassword}
                onChange={(e) => setPwData((p) => ({ ...p, currentPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Enter current password"
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={fieldLabel}>New Password</label>
              <input
                type="password"
                value={pwData.newPassword}
                onChange={(e) => setPwData((p) => ({ ...p, newPassword: e.target.value }))}
                style={inputStyle}
                placeholder="At least 6 characters"
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={fieldLabel}>Confirm New Password</label>
              <input
                type="password"
                value={pwData.confirmPassword}
                onChange={(e) => setPwData((p) => ({ ...p, confirmPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Repeat new password"
              />
            </div>

            {/* Password status */}
            {pwStatus === "saved" && (
              <div style={{ background: "#e8f5e9", color: "#2e7d32", padding: "8px 12px", borderRadius: 8, marginBottom: 10, fontSize: "13px", fontWeight: "600" }}>
                ✅ Password updated!
              </div>
            )}
            {pwStatus && pwStatus !== "saved" && (
              <div style={{ background: "#ffebee", color: "#c62828", padding: "8px 12px", borderRadius: 8, marginBottom: 10, fontSize: "13px" }}>
                ❌ {pwStatus}
              </div>
            )}

            <button
              onClick={handlePasswordChange}
              disabled={pwSaving}
              style={{
                width: "100%",
                backgroundColor: pwSaving ? "#aaa" : "#0c0c0c",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: pwSaving ? "not-allowed" : "pointer",
              }}
            >
              {pwSaving ? "UPDATING…" : "UPDATE PASSWORD"}
            </button>
          </div>

          {/* ── SAVE / LOGOUT ── */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              ...styles.mainButton,
              backgroundColor: saving ? "#aaa" : "#4CAF50",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: saving ? "not-allowed" : "pointer",
              marginTop: "8px",
            }}
          >
            {saving ? "SAVING…" : "SAVE CHANGES"}
          </button>

          <button
            onClick={handleLogout}
            style={{
              ...styles.mainButton,
              backgroundColor: "#f44336",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "15px",
              marginTop: "10px",
            }}
          >
            LOGOUT
          </button>

          {/* ── DELETE ACCOUNT ── */}
          <div style={{ borderTop: "1px solid #ddd", paddingTop: "20px", marginTop: "20px", textAlign: "center" }}>
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
                padding: "8px 20px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                borderRadius: "8px",
              }}
            >
              DELETE ACCOUNT
            </button>
          </div>
        </>
      )}
    </div>
  );
}

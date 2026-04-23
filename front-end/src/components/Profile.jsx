import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function getAuthHeader() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Profile({
  currentUser,
  goBack,
  onEditSchedule,
  onEditLocations,
  onEditMethods,
  onEditAccount,
  onLogout,
}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/profile`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setProfile(data.data);
        } else {
          setProfile(currentUser);
        }
      })
      .catch(() => setProfile(currentUser))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.topRow}>
          <BackButton onClick={goBack} />
        </div>
        <p style={{ textAlign: "center", marginTop: 40 }}>Loading profile…</p>
      </div>
    );
  }

  // Use currentUser directly — don't fetch from backend yet
  const userData = currentUser || {};
  const username = userData.username || "Student";
  const email = userData.email || "";

  console.log("Profile currentUser:", currentUser);
  console.log("Profile username:", username);
  console.log("Profile email:", email);

  const initials = String(username)
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  console.log("Profile initials:", initials);

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <div style={{ maxWidth: 720, margin: "24px auto", padding: 20 }}>
        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "8px",
              background: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{username}</div>
            <div style={{ color: "#666", marginTop: 4 }}>{email}</div>
          </div>
        </div>

        {/* Bio */}
        {userData?.bio && (
          <div
            style={{
              background: "#f5f5f5",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: 14,
              color: "#444",
            }}
          >
            {userData.bio}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={onEditSchedule}
            style={{
              padding: "12px 16px",
              background: "grey",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: 6,
            }}
          >
            Edit Schedule
          </button>

          <button
            type="button"
            onClick={onEditLocations}
            style={{
              padding: "12px 16px",
              background: "grey",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: 6,
            }}
          >
            Edit Preferred Study Locations
          </button>

          <button
            type="button"
            onClick={onEditMethods}
            style={{
              padding: "12px 16px",
              background: "grey",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: 6,
            }}
          >
            Edit Preferred Study Methods
          </button>

          {onEditAccount && (
            <button
              type="button"
              onClick={onEditAccount}
              style={{
                padding: "12px 16px",
                background: "grey",
                color: "white",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: 6,
              }}
            >
              Edit Account Details
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            style={{
              padding: "12px 16px",
              background: "grey",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              borderRadius: 6,
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
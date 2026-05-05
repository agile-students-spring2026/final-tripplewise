import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

export default function Profile({
  currentUser,
  goBack,
  onEditSchedule,
  onEditLocations,
  onEditMethods,
  onEditAccount,
  onLogout,
}) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserData(currentUser || {});
      setLoading(false);
      return;
    }

    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.email) {
          setUserData(data);
        } else {
          setUserData(currentUser || {});
        }
      })
      .catch(() => setUserData(currentUser || {}))
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

  const user = userData || {};
  const username = user.username || "Student";
  const email = user.email || "";

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
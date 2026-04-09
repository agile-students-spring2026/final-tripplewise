import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

// Profile page – loads the current user from GET /api/users/me
export default function ProfilePage({
  goBack,
  onEditSchedule,
  onEditLocations,
  onEditMethods,
  onEditAccount,
  onLogout,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        try {
          const stored = localStorage.getItem("user");
          if (stored) setUser(JSON.parse(stored));
        } catch (_) {}
        setLoading(false);
      });
  }, []);

  const handle = (cb, fallbackMsg) => {
    if (typeof cb === "function") cb();
    else alert(fallbackMsg);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.topRow}>
          <BackButton onClick={goBack} />
        </div>
        <p style={{ textAlign: "center", marginTop: 40, color: "#666" }}>Loading profile…</p>
      </div>
    );
  }

  const displayName =
    user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username ||
        "Student"
      : "Student";

  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
            <div style={{ fontSize: 20, fontWeight: 600 }}>{displayName}</div>
            <div style={{ color: "#666", marginTop: 4 }}>{user?.email || ""}</div>
            {user?.major && (
              <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
                {user.major}{user.year ? ` · ${user.year}` : ""}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
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
            {user.bio}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={() => handle(onEditSchedule, "Edit Schedule")}
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
            onClick={() => handle(onEditLocations, "Edit preferred study locations")}
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
            onClick={() => handle(onEditMethods, "Edit preferred study methods")}
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

          <button
            type="button"
            onClick={() => handle(onEditAccount, "Edit account details")}
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

          <button
            type="button"
            onClick={() => handle(onLogout, "Logout")}
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

import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";
// This is the profile page
export default function ProfilePage({
  goBack,
  onEditSchedule,
  onEditLocations,
  onEditMethods,
  onEditAccount,
  onLogout,
  user: propUser,
}) {
  const [user, setUser] = useState(propUser || { name: "Student", email: "" });
  useEffect(() => {
    if (!propUser) {
      try {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      } catch (e) {
      }
    }
  }, [propUser]);
  const handle = (cb, fallbackMsg) => {
    if (typeof cb === "function") cb();
    else alert(fallbackMsg);
  };

  const initials = (user.name || "U")
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
              borderRadius: "50%",
              background: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 600,
              borderRadius: "8px"
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{user.name}</div>
            <div style={{ color: "#666", marginTop: 4 }}>{user.email}</div>
          </div>
        </div>

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
            }}
          >
            Edit Schedule
          </button>

          <button
            type="button"
            onClick={() =>
              handle(onEditLocations, "Edit preferred study locations")
            }
            style={{
              padding: "12px 16px",
              background: "grey",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Edit Preferred Study Locations
          </button>

          <button
            type="button"
            onClick={() =>
              handle(onEditMethods, "Edit preferred study methods")
            }
            style={{
              padding: "12px 16px",
              background: "grey",
              color: "white",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
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
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function ProfileMatchPage({ profile: propProfile, id: propId, goBack, goToDashboard }) {
  const [matchProfile, setMatchProfile] = useState(propProfile || null);
  const [loading, setLoading] = useState(!propProfile && !!propId);

  useEffect(() => {
    if (!matchProfile && propId) {
      setLoading(true);
      fetch(`${API_BASE}/api/matches/${propId}`)
        .then((r) => {
          if (!r.ok) throw new Error("network");
          return r.json();
        })
        .then((data) => {
          setMatchProfile(data.data || data);
        })
        .catch(() => {
          setMatchProfile(null);
        })
        .finally(() => setLoading(false));
    }
  }, [propId, matchProfile]);

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

  if (!matchProfile) {
    return (
      <div style={styles.page}>
        <div style={styles.topRow}>
          <BackButton onClick={goBack} />
        </div>
        <p style={{ textAlign: "center", marginTop: 40, color: "#666" }}>Profile not found.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <div style={styles.profileImageBox}>PROFILE</div>

      <div style={styles.usernameBox}>{matchProfile.username || "Unknown"}</div>

      {matchProfile.matchPercentage && (
        <div style={styles.matchText}>{matchProfile.matchPercentage}% MATCH!</div>
      )}

      {matchProfile.bio && (
        <div style={styles.formGroup}>
          <label style={styles.label}>About:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.bio}</p>
          </div>
        </div>
      )}

      {matchProfile.location && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Preferred Location:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.location}</p>
          </div>
        </div>
      )}

      {matchProfile.method && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Study Method:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.method}</p>
          </div>
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>Send A Message:</label>
        <textarea style={styles.messageBox}></textarea>
      </div>

      <button style={styles.profileActionButton} onClick={() => (typeof goToDashboard === "function" ? goToDashboard() : null)}>
        SEND STUDY SYNC REQUEST
      </button>
    </div>
  );
}
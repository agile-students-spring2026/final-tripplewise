import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

// ProfileMatchPage – shows a match's full profile
// App.jsx passes: profile={selectedMatchProfile} goBack={...} goToDashboard={...}
export default function ProfileMatchPage({ profile, goBack, goToDashboard }) {
  const [matchProfile, setMatchProfile] = useState(profile || null);
  const [loading, setLoading] = useState(!profile);
  const id = profile?.id ?? null;

  // If we only have partial data (from the matches list), fetch the full profile
  useEffect(() => {
    if (id && !matchProfile) {
      setLoading(true);
      fetch(`/api/matches/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setMatchProfile(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

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

      {/* PROFILE IMAGE */}
      <div style={styles.profileImageBox}>
        PROFILE
      </div>

      {/* USERNAME */}
      <div style={styles.usernameBox}>
        {matchProfile.username || "Unknown"}
      </div>

      {/* MATCH SCORE */}
      {matchProfile.matchPercentage && (
        <div style={styles.matchText}>
          {matchProfile.matchPercentage}% MATCH!
        </div>
      )}

      {/* BIO */}
      {matchProfile.bio && (
        <div style={styles.formGroup}>
          <label style={styles.label}>About:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.bio}</p>
          </div>
        </div>
      )}

      {/* LOCATION */}
      {matchProfile.location && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Preferred Location:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.location}</p>
          </div>
        </div>
      )}

      {/* METHOD */}
      {matchProfile.method && (
        <div style={styles.formGroup}>
          <label style={styles.label}>Study Method:</label>
          <div style={styles.infoBox}>
            <p style={{ ...styles.infoText, marginBottom: 0 }}>{matchProfile.method}</p>
          </div>
        </div>
      )}

      {/* MESSAGE BOX */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Send A Message:</label>
        <textarea style={styles.messageBox}></textarea>
      </div>

      {/* SEND BUTTON */}
      <button style={styles.profileActionButton} onClick={goToDashboard}>
        SEND STUDY SYNC REQUEST
      </button>
    </div>
  );
}

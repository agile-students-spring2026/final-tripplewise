import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import BackButton from "./BackButton";

export default function Profile({ profile: propProfile, id: propId, goBack }) {
  const profileId = propProfile?.id ?? propId ?? null;
  const [profile, setProfile] = useState(propProfile || null);

  useEffect(() => {
    // if parent passed profile directly (e.g. from signup), don't fetch
    if (propProfile) return;
    if (!profile && profileId) {
      fetch(`/api/profile/${profileId}`)
        .then((r) => r.json())
        .then((data) => setProfile(data))
        .catch(() => {});
    }
  }, [profileId, profile, propProfile]);

  if (!profile) {
    return (
      <div style={styles.page}>
        <div style={styles.topRow}>
          <BackButton onClick={goBack} />
        </div>
        <div>{profileId ? "Loading..." : "No profile selected."}</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <div style={styles.profileImageBox}>PROFILE</div>

      {/* FIX: username displays correctly as long as currentUser has a username field */}
      <div style={styles.usernameBox}>{profile.username}</div>

      <div style={styles.formGroup}>
        <label style={styles.profileSectionLabel}>Classes Being Taken:</label>
        <div style={styles.infoBox}>
          {profile.classes?.map((c, i) => (
            <p key={i} style={styles.infoText}>{c}</p>
          ))}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Locations:</label>
        <div style={styles.infoBox}>
          {profile.locations?.map((l, i) => (
            <p key={i} style={styles.infoText}>{l}</p>
          ))}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Study Methods:</label>
        <div style={styles.infoBox}>
          {profile.methods?.map((m, i) => (
            <p key={i} style={styles.infoText}>{m}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
import BackButton from "./BackButton";
import { styles } from "../styles";

export default function ProfileMatchPage({ goBack, goToDashboard }) {
  return (
    <div style={styles.page}>

      {/*
        STYLING EXPLANATIONS:
        - profileImageBox: creates the image placeholder
        - usernameBox: display box for username
        - infoBox: rectangular boxes for the information
        - infoText: styling for the text within the infoBox
        - matchText: styling for the text that announces match percentage for scheduling + location
        - messageBox: message input box

        Please reuse these stylings for the other pages as well so that there is consistency on the appearance of our application.
      */}

      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      {/* PROFILE IMAGE */}
      <div style={styles.profileImageBox}>
        PROFILE
      </div>
      
      {/* USERNAME */}
      <div style={styles.usernameBox}>USERNAME</div>

      {/* CLASSES */}
      <div style={styles.formGroup}>
        <label style={styles.profileSectionLabel}>Classes Being Taken:</label>
        <div style={styles.infoBox}>
          <p style={styles.infoText}>Agile and Dev-Ops</p>
          <p style={styles.infoText}>Applied Internet Technologies</p>
          <p style={{ ...styles.infoText, marginBottom: 0 }}>Operating Systems</p>
        </div>
      </div>

      {/* PREFERRED LOCATIONS */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Locations:</label>
        <div style={styles.infoBox}>
          <p style={styles.infoText}>Bobst Library</p>
          <p style={styles.infoText}>Warren Weaver Hall</p>
          <p style={{ ...styles.infoText, marginBottom: 0 }}>Washington Square Park</p>
        </div>
      </div>

      {/* PREFERRED METHODS */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Study Methods:</label>
        <div style={styles.infoBox}>
          <p style={styles.infoText}>Quiet Study</p>
          <p style={{ ...styles.infoText, marginBottom: 0 }}>
            Energetic Conversation and Constructive Feedback
          </p>
        </div>
      </div>

      {/* MATCH SCORE */}
      <div style={styles.matchText}>90% MATCH!</div>

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
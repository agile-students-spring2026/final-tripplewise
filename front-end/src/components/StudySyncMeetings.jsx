import React, { useState } from "react";
import { styles } from "../styles";
import BackButton from "./BackButton";

export default function StudySyncMeetings({ onBack, onSendRequest }) {
  const [meetingData, setMeetingData] = useState({
    partner: "",
    time: "",
    location: "",
    message: ""
  });

  const matchedWidthBox = {
    ...styles.infoBox,
    width: "100%",
    boxSizing: "border-box"
  };

  const matchedTextArea = {
    ...styles.messageBox,
    width: "100%",
    boxSizing: "border-box"
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={onBack} />
      </div>

      <h2 style={{ ...styles.bigTitle, textAlign: "left", fontSize: "32px", marginBottom: "20px" }}>
        Study Sync Meetings
      </h2>

      <div style={{ display: "flex", flexDirection: "column" }}>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Schedule a new meeting with:</label>
          <input 
            type="text" 
            style={styles.input}
            onChange={(e) => setMeetingData({...meetingData, partner: e.target.value})}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Choose a time:</label>
          <input 
            type="text" 
            style={styles.input}
            onChange={(e) => setMeetingData({...meetingData, time: e.target.value})}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Choose a Location:</label>
          <input 
            type="text" 
            style={styles.input}
            onChange={(e) => setMeetingData({...meetingData, location: e.target.value})}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Send a message:</label>
          <textarea 
            style={matchedTextArea} 
            onChange={(e) => setMeetingData({...meetingData, message: e.target.value})}
          />
        </div>

        <button 
          style={styles.mainButton}
          onClick={() => onSendRequest(meetingData)}
        >
          Send a Study Sync Request
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        
        <h3 style={{ ...styles.label, fontSize: "16px" }}>Upcoming Study Syncs:</h3>
        <div style={matchedWidthBox}>
          <p style={styles.infoText}>• Calculus II with Sarah @ 2pm</p>
          <p style={styles.infoText}>• Systems Programming with Alex @ 5pm</p>
        </div>

        <h3 style={{ ...styles.label, fontSize: "16px", marginTop: "20px" }}>Past Study Syncs:</h3>
        <div style={matchedWidthBox}>
          <p style={{ ...styles.infoText, color: "#888" }}>• Discrete Math with Jordan (Mar 25)</p>
        </div>

      </div>
    </div>
  );
}
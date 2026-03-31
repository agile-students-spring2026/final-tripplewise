import BackButton from "./BackButton";
import { useState } from "react";
import { styles } from "../styles";

export default function EditAccountDetails({ goBack }) {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    console.log("Saved account details:", { username, oldPassword, newPassword });
    // TODO: Save to backend API
    goBack();
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "28px",
          letterSpacing: "0.05em",
          fontFamily: "serif",
          color: "black",
        }}
      >
        Edit Account Details
      </h2>

      {/* Change Profile Picture */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "bold",
            marginBottom: "8px",
            letterSpacing: "0.05em",
            fontFamily: "serif",
          }}
        >
          Change Profile Picture:
        </label>
        <div style={styles.uploadBox}>
          +
        </div>
      </div>

      {/* Change Username */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "bold",
            marginBottom: "8px",
            letterSpacing: "0.05em",
            fontFamily: "serif",
          }}
        >
          Change Username:
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            height: "36px",
            border: "1px solid black",
            backgroundColor: "white",
            padding: "6px 10px",
            boxSizing: "border-box",
            fontSize: "14px",
            borderRadius: "0",
            color: "black",
            outline: "none",
          }}
        />
      </div>

      {/* Enter Old Password */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "bold",
            marginBottom: "8px",
            letterSpacing: "0.05em",
            fontFamily: "serif",
          }}
        >
          Enter Old Password:
        </label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={{
            width: "100%",
            height: "36px",
            border: "1px solid black",
            backgroundColor: "white",
            padding: "6px 10px",
            boxSizing: "border-box",
            fontSize: "14px",
            borderRadius: "0",
            color: "black",
            outline: "none",
          }}
        />
      </div>

      {/* Enter New Password */}
      <div style={{ marginBottom: "32px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: "bold",
            marginBottom: "8px",
            letterSpacing: "0.05em",
            fontFamily: "serif",
          }}
        >
          Enter New Password:
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: "100%",
            height: "36px",
            border: "1px solid black",
            backgroundColor: "white",
            padding: "6px 10px",
            boxSizing: "border-box",
            fontSize: "14px",
            borderRadius: "0",
            color: "black",
            outline: "none",
          }}
        />
      </div>

      {/* Save Changes Button */}
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          backgroundColor: "black",
          color: "white",
          border: "none",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          letterSpacing: "0.08em",
          fontFamily: "serif",
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

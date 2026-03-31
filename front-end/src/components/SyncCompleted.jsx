import { styles } from "../styles";

export default function SyncCompleted({ onBackToDashboard }) {
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={{ marginBottom: "40px", marginTop: "20px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: "0.1em",
            margin: 0,
          }}
        >
          SYNC SETUP<br />
          SENT!
        </h1>
      </div>

      {/* Success Circle with Checkmark */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "60px",
          flex: 1,
        }}
      >
        <div
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: "#d0d0d0",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "120px",
            fontWeight: "bold",
            color: "black",
            lineHeight: "1",
          }}
        >
          ✓
        </div>
      </div>

      {/* Back to Dashboard Button */}
      <button
        onClick={onBackToDashboard}
        style={{
          width: "100%",
          backgroundColor: "black",
          color: "white",
          border: "none",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          letterSpacing: "0.05em",
          marginTop: "20px",
        }}
      >
        BACK TO DASHBOARD
      </button>
    </div>
  );
}

export const styles = {
  phoneScreen: {
    minHeight: "100vh",
    backgroundColor: "#11111b",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },

  page: {
    width: "393px",
    minHeight: "852px", // Changed from height to minHeight
    backgroundColor: "var(--bg)",
    color: "var(--text)",
    padding: "40px 24px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "44px",
    boxShadow: "var(--shadow)",
    position: "relative",
    overflowY: "auto", // Allow vertical scrolling if content overflows
    msOverflowStyle: "none", 
    scrollbarWidth: "none" 
  },

  topRow: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "32px"
  },

  backButton: {
    width: "48px",
    height: "48px",
    backgroundColor: "var(--text-h)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "24px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  bigTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "var(--text-h)",
    letterSpacing: "-1.5px",
    marginBottom: "32px",
    textAlign: "center"
  },

  illustrationPlaceholder: {
    width: "90%",
    height: "50%", 
    minHeight: "350px",
    backgroundColor: "#ffffff", 
    margin: "10px auto 30px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "24px",
    border: "2px dashed #bbb",
    boxSizing: "border-box"
  },

  formGroup: {
    width: "100%",
    marginBottom: "28px"
  },

  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text-h)",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },

  input: {
    width: "100%",
    height: "50px",
    borderRadius: "14px",
    border: "1px solid var(--border)",
    padding: "0 16px",
    boxSizing: "border-box",
    backgroundColor: "white",
    fontSize: "16px",
    color: "var(--text-h)"
  },

  mainButton: {
    width: "100%",
    backgroundColor: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    padding: "18px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "12px",
    boxShadow: "0 8px 16px -4px rgba(170, 59, 255, 0.3)",
    flexShrink: 0 // Prevent button from squishing
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    padding: "18px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "12px",
    opacity: "0.85",
    flexShrink: 0
  },

  doubleInputRow: {
    display: "flex",
    gap: "20px",
    width: "100%",
    marginBottom: "28px"
  },

  halfInputGroup: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  infoBox: {
    width: "100%",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    backgroundColor: "white",
    padding: "20px",
    minHeight: "120px",
    marginTop: "12px",
    boxSizing: "border-box"
  },

  profileImageBox: {
    width: "140px",
    height: "140px",
    borderRadius: "70px",
    backgroundColor: "var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px auto"
  },

  footer: {
    marginTop: "auto",
    paddingTop: "40px",
    paddingBottom: "20px",
    fontSize: "12px",
    color: "var(--text)",
    opacity: 0.7,
    textAlign: "center",
    flexShrink: 0
  }
};
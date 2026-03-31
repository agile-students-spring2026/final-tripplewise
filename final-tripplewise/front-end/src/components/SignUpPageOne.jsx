import BackButton from "./BackButton";
import { styles } from "../styles";

export default function SignUpPageOne({ goNext }) {
  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={() => alert("Back button clicked")} />
      </div>

      <h1 style={styles.bigTitle}>SIGN UP</h1>

      <div style={styles.stepsBox}>
        <p>1. Create an Account</p>
        <p>2. Add Your Schedule</p>
        <p>3. See Your Matches</p>
        <p>4. Partner Up, and Study!</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Enter a Username:</label>
        <input type="text" style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Enter a Password:</label>
        <input type="password" style={styles.input} />
      </div>

      <button style={styles.mainButton} onClick={goNext}>
        CREATE ACCOUNT
      </button>
    </div>
  );
}
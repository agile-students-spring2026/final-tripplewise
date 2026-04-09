import BackButton from "./BackButton";
import { styles } from "../styles";

export default function SignUpPageTwo({ goBack, goNext }) {
  function finishSignup() {
    const newUser = {
      id: Date.now(),
      username: username || "new_user",
      bio: bio || "",
      classes: classes || [],
      locations: locations || [],
      methods: methods || [],
    };
    if (typeof onComplete === "function") onComplete(newUser);
  }

  return (
      <div style={styles.page}>
        {/* ...signup form ... */}
        <button onClick={finishSignup}>COMPLETE SIGN UP</button>
    
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      {/* PROFILE IMAGE */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Upload A Profile Picture:</label>
        <div style={styles.uploadBox}>+</div>
      </div>

      {/* CLASS + TIME */}
      <div style={styles.doubleInputRow}> 
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Add Class 1:</label>
          <input type="text" style={styles.input} />
        </div>
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Time:</label>
          <input type="text" style={styles.input} />
        </div>
      </div>

      <div style={styles.doubleInputRow}>
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Add Class 2:</label>
          <input type="text" style={styles.input} />
        </div>
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Time:</label>
          <input type="text" style={styles.input} />
        </div>
      </div>

      <div style={styles.doubleInputRow}>
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Add Class 3:</label>
          <input type="text" style={styles.input} />
        </div>
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Time:</label>
          <input type="text" style={styles.input} />
        </div>
      </div>

      <div style={styles.doubleInputRow}>
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Add Class 4:</label>
          <input type="text" style={styles.input} />
        </div>
        <div style={styles.halfInputGroup}>
          <label style={styles.label}>Time:</label>
          <input type="text" style={styles.input} />
        </div>
      </div>
      
      {/* PREFERRED STUDY LOCATIONS */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Study Location 1:</label>
        <input type="text" style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Study Location 2:</label>
        <input type="text" style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Study Location 3:</label>
        <input type="text" style={styles.input} />
      </div>
      
      {/* PREFERRED STUDY METHODS */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Study Method 1:</label>
        <input type="text" style={styles.input} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Preferred Study Method 2:</label>
        <input type="text" style={styles.input} />
      </div>

      {/* SUBMIT BUTTON */}
      <button style={styles.mainButton} onClick={goNext}>
        FINISH CREATING ACCOUNT
      </button>
    </div>
    
  );
}
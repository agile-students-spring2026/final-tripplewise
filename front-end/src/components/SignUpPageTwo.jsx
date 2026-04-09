import React, { useState } from "react";
import BackButton from "./BackButton";
import { styles } from "../styles";

export default function SignUpPageTwo({ goBack, goNext, onComplete, initialUsername = "" }) {
  const [username, setUsername] = useState(initialUsername);
  const [classNames, setClassNames] = useState(["", "", "", ""]);
  const [classTimes, setClassTimes] = useState(["", "", "", ""]);
  const [locations, setLocations] = useState(["", "", ""]);
  const [methods, setMethods] = useState(["", ""]);

  function finishSignup() {
    const newUser = {
id: Date.now(),
      username: username.trim() || `user_${Date.now()}`,
      classes: classNames.filter(Boolean),
      classTimes: classTimes.filter(Boolean),
      locations: locations.filter(Boolean),
      methods: methods.filter(Boolean),
    };
    if (typeof onComplete === "function") {
      onComplete(newUser);
    } else if (typeof goNext === "function") {
      goNext();
    }
  }

  return (
    <div style={styles.page}>
      {/* PROFILE IMAGE */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Upload A Profile Picture:</label>
        <div style={styles.uploadBox}>+</div>
      </div>
      
      {/* CLASS + TIME rows */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={styles.doubleInputRow}>
          <div style={styles.halfInputGroup}>
            <label style={styles.label}>{`Add Class ${i + 1}:`}</label>
            <input value={classNames[i]} onChange={(e) => {
              const next = [...classNames]; next[i] = e.target.value; setClassNames(next);
            }} type="text" style={styles.input} />
          </div>
          <div style={styles.halfInputGroup}>
            <label style={styles.label}>Time:</label>
            <input value={classTimes[i]} onChange={(e) => {
              const next = [...classTimes]; next[i] = e.target.value; setClassTimes(next);
            }} type="text" style={styles.input} />
          </div>
        </div>
      ))}

      {/* Locations */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={styles.formGroup}>
          <label style={styles.label}>{`Preferred Study Location ${i + 1}:`}</label>
          <input value={locations[i]} onChange={(e) => {
            const next = [...locations]; next[i] = e.target.value; setLocations(next);
          }} type="text" style={styles.input} />
        </div>
      ))}

      {/* Methods */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} style={styles.formGroup}>
          <label style={styles.label}>{`Preferred Study Method ${i + 1}:`}</label>
          <input value={methods[i]} onChange={(e) => {
            const next = [...methods]; next[i] = e.target.value; setMethods(next);
          }} type="text" style={styles.input} />
        </div>
      ))}

      <div style={{ marginTop: 16 }}>
        <button style={styles.mainButton} onClick={finishSignup}>
          FINISH CREATING ACCOUNT
        </button>
      </div>
    </div>
  );
}
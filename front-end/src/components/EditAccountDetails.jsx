import BackButton from "./BackButton";
import { useState } from "react";
import { styles } from "../styles";

export default function EditAccountDetails({ goBack }) {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@nyu.edu",
    phone: "(555) 123-4567",
    major: "Computer Science",
    year: "Sophomore",
    bio: "NYU student passionate about technology and learning. Looking for study partners to collaborate with on projects and exams."
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saved account details:", formData);
    // TODO: Save to backend API
    goBack();
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // TODO: Implement logout logic
    goBack();
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>

      <h2 style={{
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        EDIT ACCOUNT DETAILS
      </h2>

      <div style={{
        marginBottom: "20px",
        fontSize: "14px",
        color: "#666",
        textAlign: "center",
        lineHeight: "1.6"
      }}>
        Update your profile information below.
      </div>

      {/* Personal Information */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={styles.label}>PERSONAL INFORMATION</div>
        
        <div style={styles.formGroup}>
          <div style={styles.label}>First Name</div>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Last Name</div>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Email Address</div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Phone Number</div>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Academic Information */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={styles.label}>ACADEMIC INFORMATION</div>
        
        <div style={styles.formGroup}>
          <div style={styles.label}>Major</div>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => handleInputChange("major", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <div style={styles.label}>Year</div>
          <select
            value={formData.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            style={{
              ...styles.input,
              height: "34px",
              borderRadius: "12px",
              border: "1px solid black",
              backgroundColor: "white",
              fontSize: "14px"
            }}
          >
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
      </div>

      {/* Bio */}
      <div style={{
        marginBottom: "20px"
      }}>
        <div style={styles.label}>BIO</div>
        <div style={styles.formGroup}>
          <div style={styles.label}>Tell us about yourself</div>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            style={{
              ...styles.input,
              height: "80px",
              resize: "vertical",
              padding: "8px"
            }}
            placeholder="Share your interests, study preferences, or anything else you'd like potential study partners to know..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "20px"
      }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "8px"
          }}
        >
          SAVE CHANGES
        </button>
        
        <button
          onClick={handleLogout}
          style={{
            flex: 1,
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "12px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "8px"
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Delete Account Option */}
      <div style={{
        borderTop: "1px solid #ddd",
        paddingTop: "20px",
        textAlign: "center"
      }}>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              console.log("Delete account clicked");
              // TODO: Implement account deletion
              goBack();
            }
          }}
          style={{
            backgroundColor: "transparent",
            color: "#f44336",
            border: "2px solid #f44336",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "6px"
          }}
        >
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
}
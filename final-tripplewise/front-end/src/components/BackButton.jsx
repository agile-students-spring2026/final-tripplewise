import { styles } from "../styles";

export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={styles.backButton}>
      ←
    </button>
  );
}
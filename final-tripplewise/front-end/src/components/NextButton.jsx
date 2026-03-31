import { styles } from "../styles";

export default function NextButton({ onClick }) {
  return (
    <button onClick={onClick} style={styles.nextButton}>
      →
    </button>
  );
}
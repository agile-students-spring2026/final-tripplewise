import BackButton from "./BackButton";
import { styles } from "../styles";

export default function ProfileMatchPage({ goBack }) {
  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <BackButton onClick={goBack} />
      </div>
    </div>
  );
}
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.css";

export default function FirstScreen() {
  const { player } = usePlayer();

  return (
    <div className={`Master ${styles.image}`}>
      <img
        src={`/src/assets/movement/${player.direction}.svg`}
        className="character"
        style={{
          transform: `translate(${player.x}px, ${player.y}px)`
        }}
      />
    </div>
  );
}
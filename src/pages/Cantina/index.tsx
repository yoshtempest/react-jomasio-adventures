import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.css";

export default function Cantina() {
  const { player } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (player.x === 50 && player.y === 250) {
      navigate("/firstscreen");
    }
  }, [player]);

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
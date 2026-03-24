// import { useEffect } from "react";
// import { useNavigate } from "react-router";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.css";

export default function Cantina() {
  const { player } = usePlayer();
  const TILE_SIZE = Math.min(window.innerWidth, window.innerHeight) / 10;
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (player.x === 50 && player.y === -110) {
  //     navigate("/firstscreen");
  //   }
  // }, [player]);

  return (
    <div className={`Master ${styles.image}`}>
      <img
        src={`/src/assets/movement/${player.direction}.svg`}
        className="character"
        style={{
          transform: `translate(${player.gridX * TILE_SIZE}px, ${player.gridY * TILE_SIZE}px)`
        }}
      />
      <img
        src={`/src/assets/jhowsimar/default.svg`}
        className={styles.jhowsimar}
      />
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.css";
import { cantina } from "../../maps/cantina";

export default function Cantina() {
  const { player, setMap } = usePlayer();
  const navigate = useNavigate();

  const MAP_COLS = 17;
  const MAP_ROWS = 13;

  const containerWidth = window.innerWidth * 0.74;
  const containerHeight = window.innerHeight;

  const SCALE_FIX = 1.4;

  const TILE_SIZE =
    Math.min(containerWidth / MAP_COLS, containerHeight / MAP_ROWS) *
    SCALE_FIX;

  const offsetX = (containerWidth - MAP_COLS * TILE_SIZE) / 2;
  const offsetY = (containerHeight - MAP_ROWS * TILE_SIZE) / 2;

  const PLAYER_SIZE = TILE_SIZE * 1.4;

  useEffect(() => {
    if (player.gridX === 6 && player.gridY === 7) {
      navigate("/cantina");
    }
  }, [player]);

  useEffect(() => {
    setMap(cantina);
  }, [setMap]);

  useEffect(() => {
    console.log("Player posição:", player.gridX, player.gridY);
  }, [player.gridX, player.gridY]);

  return (
    <div
      className={`Master ${styles.image}`}
      style={{
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: MAP_COLS * TILE_SIZE,
          height: MAP_ROWS * TILE_SIZE,
        }}
      >
        <img
          src={`/src/assets/movement/${player.direction}.svg`}
          style={{
            position: "absolute",
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,

            left: player.gridX * TILE_SIZE - 11,
            top: player.gridY * TILE_SIZE,

            transform: "translate(-10%, -20%)",
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
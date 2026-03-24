import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.css";
import { map } from "../../map";

export default function FirstScreen() {
  const { player } = usePlayer();
  const navigate = useNavigate();

  const MAP_COLS = 17;
  const MAP_ROWS = 13;

  // 📱 container real do jogo (igual ao seu layout)
  const containerWidth = window.innerWidth * 0.74;
  const containerHeight = window.innerHeight;

  // 🔧 ajuste fino (pode mexer nisso depois)
  const SCALE_FIX = 1;

  const TILE_SIZE =
    Math.min(containerWidth / MAP_COLS, containerHeight / MAP_ROWS) *
    SCALE_FIX;

  // 🎯 centralizar dentro do container
  const offsetX = (containerWidth - MAP_COLS * TILE_SIZE) / 2;
  const offsetY = (containerHeight - MAP_ROWS * TILE_SIZE) / 2;

  // 🧍 player maior que o tile
  const PLAYER_SIZE = TILE_SIZE * 1.2;

  useEffect(() => {
    if (player.gridX === 1 && player.gridY === 1) {
      navigate("/cantina");
    }
  }, [player]);

  return (
    <div
      className={styles.container}
      style={{
        width: "74vw",
        height: "100vh",
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
          src="/src/assets/cenarios/cenario.svg" // ajuste o caminho
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />

        {map.map((row, y) =>
          row.map((tile, x) => {
            const isPlayer = player.gridX === x && player.gridY === y;

            return (
              <div
                key={`${x}-${y}`}
                style={{
                  position: "absolute",
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  left: x * TILE_SIZE,
                  top: y * TILE_SIZE,

                  backgroundColor: isPlayer
                    ? "red"
                    : tile === 1.2
                    ? "transparent"
                    : "transparent", // chão visível pra debug

                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            );
          })
        )}

        {/* 🧍 PLAYER */}
        <img
          src={`/src/assets/movement/${player.direction}.svg`}
          style={{
            position: "absolute",
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,

            left: player.gridX * TILE_SIZE,
            top: player.gridY * TILE_SIZE,

            transform: "translate(-10%, -20%)", // ajuste fino visual
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.css";

export default function FirstScreen() {
  const { player } = usePlayer();
  const navigate = useNavigate();

  const MAP_COLS = 17;
  const MAP_ROWS = 13;

  // 📱 container real do jogo (igual ao seu layout)
  const containerWidth = window.innerWidth * 0.74;
  const containerHeight = window.innerHeight;

  // 🔧 ajuste fino (pode mexer nisso depois)
  const SCALE_FIX = 1.4;

  const TILE_SIZE =
    Math.min(containerWidth / MAP_COLS, containerHeight / MAP_ROWS) *
    SCALE_FIX;

  // 🎯 centralizar dentro do container
  const offsetX = (containerWidth - MAP_COLS * TILE_SIZE) / 2;
  const offsetY = (containerHeight - MAP_ROWS * TILE_SIZE) / 2;

  // 🧍 player maior que o tile
  const PLAYER_SIZE = TILE_SIZE * 1.4;

  useEffect(() => {
    if (player.gridX === 6 && player.gridY === 7) {
      navigate("/cantina");
    }
  }, [player]);

  return (
    <div
      className={`Master ${styles.image}`}
      style={{
        width: "74vw",
        height: "100vh",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 🗺️ MAPA (TUDO DENTRO DO MESMO SISTEMA) */}
      <div
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          width: MAP_COLS * TILE_SIZE,
          height: MAP_ROWS * TILE_SIZE,
        }}
      >

        {/* 🟥 GRID DEBUG */}
        {/* {map.map((row, y) =>
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
                    : tile === 1.4
                    ? "black"
                    : "transparent", // chão visível pra debug

                  border: "1px solid rgba(0,0,0,0.1)",
                }}
              />
            );
          })
        )} */}

        {/* 🧍 PLAYER */}
        <img
          src={`/src/assets/movement/${player.direction}.svg`}
          style={{
            position: "absolute",
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,

            left: player.gridX * TILE_SIZE - 11,
            top: player.gridY * TILE_SIZE,

            transform: "translate(-10%, -20%)", // ajuste fino visual
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
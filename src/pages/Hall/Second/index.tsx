import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { hallTwo } from "@/maps/hallTwo";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";

export default function HallTwo() {
  const { player, setMap, setPosition } = usePlayer();
  const navigate = useNavigate();

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } = useGameLayout();

  useEffect(() => {
    if (player.gridX === 14 && player.gridY === 7) {
      navigate("/professorsroom");
    }
  }, [player]);

  useEffect(() => {
    if (player.gridX === 12 && player.gridY === 4) {
      navigate("/classtwo");
    }
  }, [player]);

  useEffect(() => {
    if (
      player.gridX === 7 && player.gridY === 11 ||
      player.gridX === 8 && player.gridY === 11 ||
      player.gridX === 9 && player.gridY === 11
    ) {
      navigate("/hall/one");
    }
  }, [player]);

  useEffect(() => {
    setMap(hallTwo);
    setPosition(9, 10, "up");
  }, []);

  return (
    <div className={`Master ${styles.image}`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <Player
          direction={player.direction}
          gridX={player.gridX}
          gridY={player.gridY}
          TILE_SIZE={TILE_SIZE}
          PLAYER_SIZE={PLAYER_SIZE}
        />
      </GameMap>
    </div>
  );
}
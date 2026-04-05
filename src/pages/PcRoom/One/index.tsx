import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { pcsRoom } from "@/maps/pcsRoom";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";

export default function PcRoomOne() {
  const { player, setMap, setPosition } = usePlayer();
  const navigate = useNavigate();

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } = useGameLayout();

  useEffect(() => {
    if (player.gridX === 3 && player.gridY === 3) {
      navigate("/hall/one");
    }
  }, [player]);

  useEffect(() => {
    setMap(pcsRoom);
    setPosition(3, 4, "down");
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
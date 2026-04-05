import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { pcsRoom } from "@/maps/pcsRoom";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { useInventory } from "@/contexts/InventoryContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { createPcsRoom } from "@/interactions/pcsRoom";
import { useGameAudio } from "@/hooks/useGameAudio";
import MonkeyCircle from "@/assets/songs/MonkeyCircle.m4a";
import { NPC } from "@/components/Game/Npc";

export default function PcRoomOne() {
    const { player, setMap, setPosition } = usePlayer();
    const navigate = useNavigate();

    const backgroundAudio = useMemo(() => ({
      src: MonkeyCircle,
      loop: true,
      volume: 0.5,
    }), []);

    useGameAudio(backgroundAudio);

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
          <NPC
            src="/src/assets/npcs/janderson/default.svg"
            gridX={8}
            gridY={8}
            TILE_SIZE={TILE_SIZE}
          />
        </GameMap>
      </div>
    );
}
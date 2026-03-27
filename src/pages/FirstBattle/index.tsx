import { useEffect, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { cantina } from "@/maps/cantina";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { Player } from "@/components/Game/Player";
import { NPC } from "@/components/Game/Npc";
import KenTheme from "@/assets/StreetFighter5KenTheme.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";


export default function Cantina() {
  const { player, setMap } = usePlayer();

  const backgroundAudio = useMemo(() => ({
    src: KenTheme,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(backgroundAudio);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(cantina);
  }, [setMap]);

  return (
    <div className={`Master ${styles.image}`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPC src="/src/assets/jhowsimar/default.svg" gridX={9} gridY={4} TILE_SIZE={TILE_SIZE} />
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
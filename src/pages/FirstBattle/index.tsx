import { useEffect, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { firstBattle } from "@/maps/firstBattle";
import { useGameLayout } from "@/hooks/useGameLayout";
import { GameMap } from "@/components/Game/GameMap";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import { NPCBattle } from "@/components/Game/Npc/Battle";
import KenTheme from "@/assets/StreetFighter5KenTheme.m4a";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNpcAI } from "@/hooks/useNpcAi";

export default function FirstBattle() {
  const { player, setMap, setMode, punch } = usePlayer();
  const { setOnConfirm } = useGameControls();

  const npc = useNpcAI(player.x);

  const backgroundAudio = useMemo(() => ({
    src: KenTheme,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(backgroundAudio);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  useEffect(() => {
    setMap(firstBattle);
    setMode("battle");
  }, []);

  useEffect(() => {
    setOnConfirm(() => punch);
    return () => setOnConfirm(undefined);
  }, [punch]);

  return (
    <div className={`Master ${styles.image}`}>
      <GameMap
        TILE_SIZE={TILE_SIZE}
        offsetX={offsetX}
        offsetY={offsetY}
        cols={MAP_COLS}
        rows={MAP_ROWS}
      >
        <NPCBattle
          x={npc.x}
          y={npc.y}
          TILE_SIZE={TILE_SIZE}
          npcType="jhowsimar"
          state={npc.state}
        />

        <PlayerBattle
          x={player.x}
          y={player.y}
          PLAYER_SIZE={PLAYER_SIZE}
          state={player.state}
          direction={player.battleDirection}
        />
      </GameMap>
    </div>
  );
}
import { useEffect, useMemo, useState, useRef } from "react";
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
import { HealthBar } from "@/components/Game/HealthBar"

export default function FirstBattle() {
  const { player, setMap, setMode, punch } = usePlayer();
  const { setOnConfirm } = useGameControls();

  const [playerHP, setPlayerHP] = useState(100);
  const [npcHP, setNpcHP] = useState(100);

  function isInRange() {
    const distance = Math.abs(player.x - npc.x);
    return distance < 80; // ajusta depois
  }

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

  const canHitRef = useRef(true);

  function tryHit() {
    if (!canHitRef.current) return;

    canHitRef.current = false;

    if (isInRange()) {
      setNpcHP((hp) => Math.max(0, hp - 10));
    }

    setTimeout(() => {
      canHitRef.current = true;
    }, 400);
  }

  useEffect(() => {
    function handleAttack() {
      punch();
      tryHit();
    }

    setOnConfirm(() => handleAttack);

    return () => setOnConfirm(undefined);
  }, [punch]); // ✅ só isso

  return (
    <div className={`Master ${styles.image}`}>
      
    {/* 🔵 PLAYER HP */}
    <div style={{ position: "absolute", top: 20, left: 20 }}>
      <HealthBar hp={playerHP} />
    </div>

    {/* 🔴 NPC HP */}
    <div style={{ position: "absolute", top: 20, right: 20 }}>
      <HealthBar hp={npcHP} />
    </div>
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
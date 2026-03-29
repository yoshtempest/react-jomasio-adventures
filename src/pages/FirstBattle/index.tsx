import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useGameLayout } from "@/hooks/useGameLayout";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNpcAI } from "@/hooks/npc/useNpcAi";
import { useBattleSystem } from "@/hooks/battle/useBattleSystem";
import { GameMap } from "@/components/Game/GameMap";
import { PlayerBattle } from "@/components/Game/Player/Battle";
import { NPCBattle } from "@/components/Game/Npc/Battle";
import { HealthBar } from "@/components/Game/HealthBar";
import { firstBattle } from "@/maps/firstBattle";
import KenTheme from "@/assets/StreetFighter5KenTheme.m4a";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";

export default function FirstBattle() {
  const { player, setMap, setMode, punch } = usePlayer();
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();
  const [showVictory, setShowVictory] = useState(false);

  // 🎵 áudio
  const audio = useMemo(() => ({
    src: KenTheme,
    loop: true,
    volume: 0.5,
  }), []);

  useGameAudio(audio);

  const
  {
    TILE_SIZE,
    offsetX,
    offsetY,
    PLAYER_SIZE,
    MAP_COLS,
    MAP_ROWS
  } = useGameLayout();

  const npcDummyAttackRef = useRef<() => void>(() => {});

  const npc = useNpcAI({
    playerX: player.x,
    onAttack: () => npcDummyAttackRef.current(),
    isPaused: showVictory,
  });

  // Batalha denovo se morrer para o npc e vai para Cantina se matar o npc
  const battle = useBattleSystem({
    playerX: player.x,
    npcX: npc.x,
    onPlayerDeath: () => setMode("battle"),
    onNpcDeath: () => setShowVictory(true),
  });

  // conecta ataque do NPC (sem loop)
  const npcAttackRef = useRef(battle.npcHit);
  npcAttackRef.current = battle.npcHit;

  npcDummyAttackRef.current = () => npcAttackRef.current();

  useEffect(() => {
    setMap(firstBattle);
    setMode("battle");
  }, []);

  // Punch - button A
  useEffect(() => {
    function handleAttack() {
      if (showVictory) return;
      punch();
      battle.playerHit();
    }

    setOnConfirm(() => handleAttack);

    return () => setOnConfirm(undefined);
  }, [punch, battle.playerHit, showVictory]);

  return (
    <div className={`Master ${styles.image}`}>
      
      {/* PLAYER HP */}
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <HealthBar hp={battle.playerHP} />
      </div>

      {/* NPC HP */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <HealthBar hp={battle.npcHP} />
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
          direction={npc.direction}
        />

        <PlayerBattle
          x={player.x}
          y={player.y}
          PLAYER_SIZE={PLAYER_SIZE}
          state={player.state}
          direction={player.battleDirection}
        />
      </GameMap>
      {showVictory && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h1>Vitória!</h1>
            <p>Você derrotou "Jhow Simar, o Vigia"</p>
            <p>XP adquirido: 1xp</p>
            <p>XP para o próximo nível: 99xp</p>
            <p>Progresso na história: 0.1%</p>

            <button
              onClick={() => navigate("/cantina")}
              className={styles.button}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
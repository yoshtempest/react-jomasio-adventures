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
import { Deliciometro } from "@/components/Game/Deliciometro";
import { VictoryModal } from "@/components/VictoryModal";
import { useVictory } from "@/hooks/useVictory";
import { DefeatModal } from "@/components/DefeatModal";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { NPCS } from "@/data/npc";
import { generateNpcLevel } from "@/utils/generateNpcLevel";
import { calculateXP } from "@/utils/calculateXp";

type BattleSceneProps = {
  map: any;
  npcType: string;
  redirectTo: string;
  victoryDescription: string;
  className?: string;
  audioSrc: string;
};

export function BattleScene({
  map,
  npcType,
  redirectTo,
  className,
  audioSrc,
}: BattleSceneProps) {
  const { addXP } = useCharacterProgress();
  const { player, setMap, setMode, attack, special } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const [showDefeat, setShowDefeat] = useState(false);
  const [npcLevel] = useState(() => generateNpcLevel());
  const npcData = NPCS[npcType];
  const xpReward = calculateXP(npcLevel, npcData.class);
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const { showVictory, triggerVictory, handleContinue } = useVictory({
    redirectTo,
  });

  // 🎵 áudio
  const audio = useMemo(
    () => ({
      src: audioSrc,
      loop: true,
      volume: 0.5,
    }),
    [audioSrc]
  );

  useGameAudio(audio);

  const { TILE_SIZE, offsetX, offsetY, PLAYER_SIZE, MAP_COLS, MAP_ROWS } =
    useGameLayout();

  const npcDummyAttackRef = useRef<() => void>(() => {});

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    onAttack: () => npcDummyAttackRef.current(),
    isPaused: showVictory || showDefeat,
  });

  const battle = useBattleSystem({
    playerX: player.x,
    playerY: player.y,
    npcX: npc.x,
    npcY: npc.y,
    playerState: player.state,
    onPlayerDeath: () => {
      setShowDefeat(true);
    },
    onNpcDeath: () => {
      addXP(player.character, xpReward);
      triggerVictory();
    },
  });

  // conectar ataque NPC
  const npcAttackRef = useRef(battle.npcHit);
  npcAttackRef.current = battle.npcHit;

  npcDummyAttackRef.current = () => npcAttackRef.current();

  function handleRetry() {
    window.location.reload();
  }

  useEffect(() => {
    setMap(map);
    setMode("battle");
  }, [map]);

  // attack
  useEffect(() => {
    if (showVictory) return;

    const controls = {
      onConfirm: () => {
        attack();
        battle.playerHit();
      },
      onCancel: () => {
        special();
        battle.specialHit();
      },
    };

    pushControls(controls);

    return () => popControls();
  }, [attack, battle.playerHit, battle.specialHit, showVictory]);

  return (
    <div className={`Master ${className || ""}`}>
      {/* PLAYER HP */}
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <HealthBar hp={battle.playerHP} />
      </div>

      {/* DELICIÔMETRO */}
      <div style={{ position: "absolute", top: 42, left: 20 }}>
        <Deliciometro delicia={battle.delicia} />
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
          npcType={npcType}
          state={npc.state}
          direction={npc.direction}
        />

        <PlayerBattle
          character={player.character}
          x={player.x}
          y={player.y}
          PLAYER_SIZE={PLAYER_SIZE}
          state={player.state}
          direction={player.battleDirection}
        />
      </GameMap>

      {showVictory && (
        <VictoryModal
          isOpen={showVictory}
          enemyType={npcType}
          enemyLevel={npcLevel}
          myLevel={charProgress.level}
          nextLevelXp={missingXp}
          onContinue={handleContinue}
        />
      )}

      {showDefeat && (
        <DefeatModal
          isOpen={showDefeat}
          onContinue={handleRetry}
        />
      )}
    </div>
  );
}
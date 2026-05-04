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
import { VictoryModal } from "@/components/Game/Modal/Victory";
import { useVictory } from "@/hooks/useVictory";
import { DefeatModal } from "@/components/Game/Modal/Defeat";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { NPCS } from "@/data/npc";
import { generateNpcLevel } from "@/utils/generateNpcLevel";
import { calculateXP } from "@/utils/calculateXp";
import { useNavigate } from "react-router";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { ProjectileSprite } from "@/components/Projectile";

type Props = {
  map: any;
  npcType: string;
  redirectTo?: string;
  victoryDescription: string;
  className?: string;
  audioSrc: string;
  onVictory?: () => void;
};

export function BattleScene({
  map,
  npcType,
  redirectTo,
  className,
  audioSrc,
  onVictory,
}: Props) {
  const { addXP } = useCharacterProgress();
  const { closeInventory } = useInventory();
  const { closeNavbar } = useNavbar(); // assumindo que existe
  const { player, setMap, setMode, attack, special, resetBattleState } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const [showDefeat, setShowDefeat] = useState(false);
  const [npcLevel] = useState(() => generateNpcLevel());
  const npcData = NPCS[npcType];
  const xpReward = calculateXP(npcLevel, npcData.class) ?? 0;
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;
  const npcStats = getNpcStats(npcLevel, npcData.class);
  
  const navigate = useNavigate();

  const { showVictory, triggerVictory } = useVictory({
    redirectTo,
  });

  function handleContinue() {
    if (onVictory) {
      onVictory(); // 👈 usa navigate(-1)
    } else if (redirectTo) {
      navigate(redirectTo); // fallback padrão
    }
  }

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
  const npcRangedAttackRef = useRef<() => void>(() => {});
  const npcMeleeAttackRef = useRef<() => void>(() => {});

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    npcType: npcType,
    onProjectileHit: () => npcRangedAttackRef.current(),
    onMeleeHit: () => npcMeleeAttackRef.current(),
    isPaused: showVictory || showDefeat,
  });

  const battle = useBattleSystem({
    playerX: player.x,
    playerY: player.y,
    npcX: npc.x,
    npcY: npc.y,
    playerState: player.state,
    npcLevel: npcLevel,
    npcClass: npcData?.class ?? "common",
    onPlayerDeath: () => {
      setShowDefeat(true);
    },
    onNpcDeath: () => {
      addXP(player.character, xpReward);
      triggerVictory();
    },
  });

  npcRangedAttackRef.current = battle.npcRangedHit;
  npcMeleeAttackRef.current = battle.npcMeleeHit;

  function handleRetry() {
    setShowDefeat(false);

    battle.resetBattle();     // HP + delicia
    npc.resetNpc();           // posição NPC
    resetBattleState();
  }
  function goBack() {
    navigate(-1)
  }

  useEffect(() => {
    setMap(map);
    setMode("battle");

    closeInventory();
    closeNavbar();
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
        <HealthBar hp={battle.playerHP} maxHp={battle.playerMaxHp}/>
      </div>

      {/* DELICIÔMETRO */}
      <div style={{ position: "absolute", top: 42, left: 20 }}>
        <Deliciometro delicia={battle.delicia} hitsToSpecial={battle.hitsToSpecial} />
      </div>

      {/* NPC HP */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <HealthBar hp={battle.npcHP} maxHp={npcStats.hp}/>
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
          piercings={battle.piercings}
          isExploding={battle.isExploding}
          projectile={npc.projectile}
        />

        {npc.projectile && (
          <ProjectileSprite
            projectile={npc.projectile}
            TILE_SIZE={TILE_SIZE}
          />
        )}

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
          xpReward={xpReward}
          nextLevelXp={missingXp}
          onContinue={handleContinue}
        />
      )}

      {showDefeat && (
        <DefeatModal
          isOpen={showDefeat}
          onContinue={handleRetry}
          onBack={goBack}
        />
      )}
    </div>
  );
}
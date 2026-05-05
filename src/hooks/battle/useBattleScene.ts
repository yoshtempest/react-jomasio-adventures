import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNpcAI } from "@/hooks/npc/useNpcAi";
import { useBattleSystem } from "@/hooks/battle/useBattleSystem";
import { useVictory } from "@/hooks/useVictory";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { NPCS } from "@/data/npc";
import { generateNpcLevel } from "@/utils/generateNpcLevel";
import { calculateXP } from "@/utils/calculateXp";
import { useNavigate } from "react-router";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";

type Props = {
  map: any;
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
};

export function useBattleScene({
  map,
  npcType,
  redirectTo,
  audioSrc,
  onVictory,
}: Props) {
  const navigate = useNavigate();

  const { player, setMap, setMode, attack, special, resetBattleState } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { addXP, progress, getXPToNextLevel } = useCharacterProgress();
  const { closeInventory } = useInventory();
  const { closeNavbar } = useNavbar();

  const [showDefeat, setShowDefeat] = useState(false);
  const [npcLevel] = useState(() => generateNpcLevel());
  const [npcPhase, setNpcPhase] = useState(1);

  const npcData = NPCS[npcType];
  const xpReward = calculateXP(npcLevel, npcData.class) ?? 0;

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const npcStats = getNpcStats(npcLevel, npcData.class);

  const { showVictory, triggerVictory } = useVictory({ redirectTo });

  // 🎵 áudio
  useGameAudio({
    src: audioSrc,
    loop: true,
    volume: 0.5,
  });

  // refs de ataque
  const npcRangedAttackRef = useRef<() => void>(() => {});
  const npcMeleeAttackRef = useRef<() => void>(() => {});

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    npcType,
    npcPhase,
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
    npcLevel,
    npcClass: npcData.class,
    onPlayerDeath: () => setShowDefeat(true),
    onNpcDeath: () => {
      addXP(player.character, xpReward);
      triggerVictory();
    },
  });

  useEffect(() => {
    setNpcPhase(battle.npcPhase);
  }, [battle.npcPhase]);

  npcRangedAttackRef.current = battle.npcRangedHit;
  npcMeleeAttackRef.current = battle.npcMeleeHit;

  // setup inicial
  useEffect(() => {
    setMap(map);
    setMode("battle");
    closeInventory();
    closeNavbar();
  }, [map]);

  // controles
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

  function handleRetry() {
    setShowDefeat(false);
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
  }

  function handleContinue() {
    if (onVictory) onVictory();
    else if (redirectTo) navigate(redirectTo);
  }

  return {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    charProgress,
    missingXp,
    xpReward,
    showVictory,
    showDefeat,
    handleRetry,
    handleContinue,
    navigate,
  };
}
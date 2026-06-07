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
import { useLocation } from "react-router";

type Props = {
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
};

export function useBattleScene({
  npcType,
  redirectTo,
  audioSrc,
  onVictory,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const { player, setMode, attack, special, resetBattleState, difficulty } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { addXP, progress, getXPToNextLevel } = useCharacterProgress();
  const { closeInventory } = useInventory();
  const { closeNavbar } = useNavbar();

  const [showDefeat, setShowDefeat] = useState(false);
  const [npcLevel] = useState(() => generateNpcLevel());
  const [npcPhase, setNpcPhase] = useState(1);
  const [showIntro, setShowIntro] = useState(true);

  const npcData = NPCS[npcType];
  const xpReward = calculateXP(npcLevel, npcData.class) ?? 0;

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const npcStats = getNpcStats(npcLevel, npcData.class, difficulty);

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
    isPaused: showVictory || showDefeat || showIntro,
  });

  const battle = useBattleSystem({
    playerX: player.x,
    playerY: player.y,
    npcX: npc.x,
    npcY: npc.y,
    playerState: player.state,
    npcLevel,
    npcClass: npcData.class,
    difficulty,
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
    setMode("battle");
    closeInventory();
    closeNavbar();
  }, []);

  // refs para evitar stale closures nos controles
  const attackRef = useRef(attack);
  const specialRef = useRef(special);
  const playerHitRef = useRef(battle.playerHit);
  const specialHitRef = useRef(battle.specialHit);
  attackRef.current = attack;
  specialRef.current = special;
  playerHitRef.current = battle.playerHit;
  specialHitRef.current = battle.specialHit;

  // controles
  useEffect(() => {
    if (showVictory || showIntro) return;

    const controls = {
      onConfirm: () => {
        attackRef.current();
        playerHitRef.current();
      },
      onCancel: () => {
        specialRef.current();
        specialHitRef.current();
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [showVictory, showIntro]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  function skipIntro() {
    setShowIntro(false);
  }

  function handleRetry() {
    setShowDefeat(false);
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
  }

  function handleContinue() {
    if (onVictory) onVictory();

    if (redirectTo) {
      navigate(redirectTo, {
        state: { from: location.pathname }
      });
    }
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
    showIntro,
    skipIntro,
  };
}
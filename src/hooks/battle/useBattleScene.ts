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
import { useNavigate } from "react-router";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useLocation } from "react-router";
import { useBattleRewards } from "@/hooks/battle/useBattleRewards";
import { useSummons } from "@/hooks/battle/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/usePlayerBattleActions";
import { useSummonAI } from "@/hooks/battle/useSummonsAi";

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

  const {
    player,
    setMode,
    attack,
    special,
    resetBattleState,
    difficulty,
    playerClass
  } = usePlayer();

  const {
    pushControls,
    popControls
  } = useGameControls();
  
  const {
    progress,
    getXPToNextLevel
  } = useCharacterProgress();

  const { closeInventory } = useInventory();
  const { closeNavbar } = useNavbar();

  const [showDefeat, setShowDefeat] = useState(false);
  const [npcLevel] = useState(() => generateNpcLevel());
  const [npcPhase, setNpcPhase] = useState(1);
  const [showIntro, setShowIntro] = useState(true);

  const npcData = NPCS[npcType];

  const {
    xpReward,
    giveRewards,
    giveSummonRewards,
  } = useBattleRewards({
    npcClass: npcData.class,
    npcLevel,
  });

  const {
    summons,
    setSummons,
    summonNpc,
    clearSummons,
    updateNpcPosition,
  } = useSummons({
    npcLevel,
    difficulty,
    playerX: player.x,
    playerGroundY: player.groundY,
  });

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const npcStats = getNpcStats(npcLevel, npcData.class, difficulty);

  const { showVictory, triggerVictory } = useVictory({ redirectTo });

  useGameAudio({
    src: audioSrc,
    loop: true,
    volume: 0.5,
  });

  const npcRangedAttackRef = useRef<() => void>(() => {});
  const npcMeleeAttackRef = useRef<() => void>(() => {});

  const playerYRef = useRef(player.y);
  playerYRef.current = player.y;

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
    onSummon: summonNpc,
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
      giveRewards();
      triggerVictory();
    },
  });

  const {
    handlePlayerHit,
    handleSpecialHit,
  } = usePlayerBattleActions({
    player,
    npc,
    summons,
    setSummons,
    npcHP: battle.npcHP,
    playerClass,
    progress,
    npcLevel,
    battle,
    giveSummonRewards,
  });

  const isPaused =
    showVictory ||
    showDefeat ||
    showIntro;

  useSummonAI({
    summons,
    setSummons,
    isPaused,
    playerX: player.x,
    playerClass,
    npcLevel,
    difficulty,
    damagePlayer: battle.damagePlayer,
  });

  // Track NPC position for summon spawns
  useEffect(() => {
    updateNpcPosition(npc.x);
  }, [npc.x, updateNpcPosition]);

  // Despawn summons on boss phase 2
  useEffect(() => {
    if (battle.npcPhase === 2) {
      clearSummons();
    }
  }, [battle.npcPhase]);

  useEffect(() => {
    setNpcPhase(battle.npcPhase);
  }, [battle.npcPhase]);

  npcRangedAttackRef.current = battle.npcRangedHit;
  npcMeleeAttackRef.current = battle.npcMeleeHit;

  useEffect(() => {
    setMode("battle");
    closeInventory();
    closeNavbar();
  }, []);

  const attackRef = useRef(attack);
  const specialRef = useRef(special);
  const playerHitRef = useRef(handlePlayerHit);
  const specialHitRef = useRef(handleSpecialHit);
  attackRef.current = attack;
  specialRef.current = special;
  playerHitRef.current = handlePlayerHit;
  specialHitRef.current = handleSpecialHit;

  useEffect(() => {
    if (showVictory || showDefeat || showIntro) return;

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
  }, [showVictory, showDefeat, showIntro]);

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
    clearSummons();
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
    summons,
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

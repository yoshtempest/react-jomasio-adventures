import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useNpcAi";
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
import { useSummons } from "@/hooks/battle/npc/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerBattleActions";
import { useSummonAI } from "@/hooks/battle/npc/useSummonsAi";
import { useBattleControls } from "@/hooks/battle/useBattleControls";
import { useTitles } from "@/contexts/TitleContext";

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
      incrementKillCounterRef.current(npcTypeRef.current, npcDataRef.current.class);
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

  const clearSummonsRef = useRef(clearSummons);
  clearSummonsRef.current = clearSummons;

  // Despawn summons on boss phase 2
  useEffect(() => {
    if (battle.npcPhase === 2) {
      clearSummonsRef.current();
    }
  }, [battle.npcPhase]);

  useEffect(() => {
    setNpcPhase(battle.npcPhase);
  }, [battle.npcPhase]);

  npcRangedAttackRef.current = battle.npcRangedHit;
  npcMeleeAttackRef.current = battle.npcMeleeHit;

  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const closeInventoryRef = useRef(closeInventory);
  closeInventoryRef.current = closeInventory;
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;

  useEffect(() => {
    setModeRef.current("battle");
    closeInventoryRef.current();
    closeNavbarRef.current();
  }, []);

  const { incrementKillCounter } = useTitles();
  const incrementKillCounterRef = useRef(incrementKillCounter);
  incrementKillCounterRef.current = incrementKillCounter;
  const npcTypeRef = useRef(npcType);
  npcTypeRef.current = npcType;
  const npcDataRef = useRef(npcData);
  npcDataRef.current = npcData;

  useBattleControls({
    attack,
    special,
    handlePlayerHit,
    handleSpecialHit,
    disabled: isPaused,
  });

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

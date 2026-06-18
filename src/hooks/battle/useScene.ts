import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useNpcAi";
import { useBattleSystem } from "@/hooks/battle/useSystem";
import { useVictory } from "@/hooks/useVictory";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useNavigate } from "react-router";
import { useInventory } from "@/contexts/InventoryContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useLocation } from "react-router";
import { useNpcSetup } from "@/hooks/battle/npc/useNpcSetup";
import { useBattleRewards, type RewardInfo } from "@/hooks/battle/useRewards";
import { useSummons } from "@/hooks/battle/npc/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/npc/useSummonsAi";
import { useBattleControls } from "@/hooks/battle/useControls";
import { useComboSystem } from "@/hooks/battle/useComboSystem";
import { useBattleRefs } from "@/hooks/battle/useRefs";
import { useBattleKillCounter } from "@/hooks/battle/useKillCounter";
import { useChargeAttack } from "@/hooks/battle/useChargeAttack";
import type { BattleMapConfig } from "@/utils/types/battleMap";

type Props = {
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
  map?: BattleMapConfig;
};

export function useBattleScene({
  npcType,
  redirectTo,
  audioSrc,
  onVictory,
  map,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    player,
    setPlayer,
    setMode,
    attack,
    special,
    resetBattleState,
    difficulty,
    playerClass,
    setPlayerState,
    lastBlockPressRef,
  } = usePlayer();

  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { closeInventory } = useInventory();
  const { closeNavbar } = useNavbar();

  const [showDefeat, setShowDefeat] = useState(false);
  const [lastRewards, setLastRewards] = useState<RewardInfo | null>(null);
  const [npcPhase, setNpcPhase] = useState(1);
  const [showIntro, setShowIntro] = useState(true);

  const { npcData, npcLevel, npcStats } = useNpcSetup(npcType, difficulty);

  const { xpReward, giveRewards, giveSummonRewards } = useBattleRewards({
    npcClass: npcData.class,
    npcLevel,
    npcType,
  });

  const { summons, setSummons, summonNpc, clearSummons, updateNpcPosition } =
    useSummons({
      npcLevel,
      difficulty,
      playerX: player.x,
      playerGroundY: player.groundY,
    });

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const { showVictory, triggerVictory } = useVictory({ redirectTo });

  useGameAudio({ src: audioSrc, loop: true, volume: 0.5 });

  const refs = useBattleRefs();

  const clearSummonsRef = useRef(clearSummons);
  clearSummonsRef.current = clearSummons;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const closeInventoryRef = useRef(closeInventory);
  closeInventoryRef.current = closeInventory;
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;

  const killCounter = useBattleKillCounter();
  killCounter.npcTypeRef.current = npcType;
  killCounter.npcDataRef.current = npcData;

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    npcType,
    npcPhase,
    onProjectileHit: () => refs.npcRangedAttackRef.current(),
    onMeleeHit: () => refs.npcMeleeAttackRef.current(),
    isPaused: showVictory || showDefeat || showIntro,
    onSummon: summonNpc,
    obstacles: map?.obstacles,
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
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
      const rewards = giveRewards();
      setLastRewards(rewards);
      triggerVictory();
      killCounter.handleNpcDeath(
        killCounter.npcTypeRef.current,
        killCounter.npcDataRef.current.class,
      );
    },
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
    registerHitRef: refs.registerHitRef,
    setPlayer,
    lastBlockPressRef,
  });

  const {
    comboCount,
    comboRank,
    progress: comboProgressValue,
    nextRank,
    registerHit,
    resetCombo,
  } = useComboSystem({ npcMaxHp: battle.npcMaxHp });
  refs.registerHitRef.current = registerHit;
  refs.spawnDamageRef.current = battle.spawnDamageNumber;

  const { handlePlayerHit, handleSpecialHit } = usePlayerBattleActions({
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
    spawnDamageRef: refs.spawnDamageRef,
    registerHitRef: refs.registerHitRef,
    setPlayerHP: battle.setPlayerHP,
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

  const isPaused = showVictory || showDefeat || showIntro;

  useSummonAI({
    summons,
    setSummons,
    isPaused,
    playerX: player.x,
    playerY: player.y,
    playerClass,
    npcLevel,
    difficulty,
    damagePlayer: battle.damagePlayer,
    spawnDamageRef: refs.spawnDamageRef,
    hitstopRef: refs.hitstopRef,
  });

  useEffect(() => {
    updateNpcPosition(npc.x);
  }, [npc.x, updateNpcPosition]);

  useEffect(() => {
    if (battle.npcPhase === 2) {
      clearSummonsRef.current();
    }
  }, [battle.npcPhase]);

  useEffect(() => {
    setNpcPhase(battle.npcPhase);
  }, [battle.npcPhase]);

  refs.npcRangedAttackRef.current = () => {
    if (player.state === "charging") charge.cancelCharge();
    battle.npcRangedHit();
  };
  refs.npcMeleeAttackRef.current = () => {
    if (player.state === "charging") charge.cancelCharge();
    battle.npcMeleeHit();
  };

  useEffect(() => {
    setModeRef.current("battle");
    closeInventoryRef.current();
    closeNavbarRef.current();
  }, []);

  const charge = useChargeAttack({
    player,
    setPlayer,
    npcX: npc.x,
    npcY: npc.y,
    npcArmor: battle.npcArmor,
    char: battle.char,
    playerClass,
    critRate: battle.critRate,
    titleDamageBonus: battle.titleDamageBonus,
    setNpcHP: battle.setNpcHP,
    playerCooldown: battle.playerCooldown,
    isEnding: battle.isEnding,
    hitstopRef: refs.hitstopRef,
    spawnDamageRef: refs.spawnDamageRef,
    registerHitRef: refs.registerHitRef,
    setPlayerState,
    summons,
    setSummons,
    setDelicia: battle.setDelicia,
    hitsToSpecial: battle.hitsToSpecial,
    setPlayerHP: battle.setPlayerHP,
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

  useBattleControls({
    attack,
    special,
    handlePlayerHit,
    handleSpecialHit,
    disabled: isPaused,
    onChargePress: charge.startCharge,
    onChargeRelease: charge.releaseCharge,
    onChargeCancel: charge.cancelCharge,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  function skipIntro() {
    setShowIntro(false);
  }

  function handleRetry() {
    charge.cancelCharge();
    setShowDefeat(false);
    clearSummons();
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
    resetCombo();
  }

  function handleContinue() {
    if (onVictory) onVictory();
    if (redirectTo) {
      navigate(redirectTo, { state: { from: location.pathname } });
    }
  }

  return {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    summons,
    pet: battle.pet,
    charProgress,
    missingXp,
    xpReward,
    lastRewards,
    showVictory,
    showDefeat,
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
    comboCount,
    comboRank,
    comboProgress: comboProgressValue,
    nextRank,
    charge,
  };
}

import { useRef, useState, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useAi";
import { useBattleSystem } from "@/hooks/battle/useSystem";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePetProgress } from "@/contexts/PetProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useNavigate, useLocation } from "react-router";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useTitles } from "@/contexts/TitleContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { useNpcSetup } from "@/hooks/battle/npc/useSetup";
import { useBattleRewards } from "@/hooks/battle/rewards/useRewards";
import { useSummons } from "@/hooks/battle/summon/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/summon/useAi";
import { useBattleControls } from "@/hooks/battle/useControls";
import { useComboSystem } from "@/hooks/battle/useComboSystem";
import { useBattleRefs } from "@/hooks/battle/useRefs";
import { useBattleKillCounter } from "@/hooks/battle/useKillCounter";
import { useChargeAttack } from "@/hooks/battle/charge/useAttack";
import { usePhaseTransition } from "@/hooks/battle/usePhaseTransition";
import { useBattleIntro } from "@/hooks/battle/useIntro";
import { useBattleOutro } from "@/hooks/battle/useOutro";
import { useBattleSync } from "@/hooks/battle/useSync";
import { useNpcTargeting } from "@/hooks/battle/npc/useNpcTargeting";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { saveGame } from "@/utils/save/saveGame";
import { loadBestTime, saveBestTime } from "@/utils/bestTime";
import { incrementDeath } from "@/utils/rewards/deathCounter";
import { incrementBlockCount } from "@/utils/rewards/blockCounter";
import { recordWin, recordDefeat } from "@/utils/rewards/streakStats";
import {
  incrementDamageDealtStats,
  incrementDamageTakenStats,
  incrementMissesStats,
  incrementEquipmentDropsStats,
  incrementHitsUsedStats,
  incrementSpecialsUsedStats,
  incrementAttacksUsedStats,
} from "@/utils/rewards/battleStats";

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

  const { progress, reduceHunger, getXPToNextLevel } = useCharacterProgress();
  const playerLevel = progress[player.character]?.level ?? 1;
  const { getPetProgress } = usePetProgress();
  const { getEquippedInfo } = useEquipment();
  const petInfo = getEquippedInfo(player.character, "pet");
  const petLevel = petInfo ? getPetProgress(petInfo.id).level : 1;
  const { items: inventoryItems, closeInventory } = useInventory();
  const { quests, progressDailyWeekly } = useQuests();
  const { closeNavbar } = useNavbar();
  const {
    handleDefeat,
    incrementBlockCounter,
    incrementDamageTaken,
    incrementDamageDealt,
    incrementDodgeCounter,
  } = useTitles();

  const { addBattleTime } = usePlayTime();

  const [npcPhase, setNpcPhase] = useState(1);
  const npcPhaseRef = useRef(npcPhase);
  npcPhaseRef.current = npcPhase;
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);
  const [isGrabbed, setIsGrabbed] = useState(false);

  const battleStartRef = useRef(Date.now());
  const [defeatElapsed, setDefeatElapsed] = useState(0);
  const [victoryElapsed, setVictoryElapsed] = useState(0);
  const [bestTime, setBestTime] = useState(loadBestTime(npcType));

  const { showIntro, skipIntro } = useBattleIntro();

  const { npcData, npcLevel, npcStats } = useNpcSetup(npcType, difficulty, playerLevel);

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

  const {
    showVictory,
    triggerVictory,
    showDefeat,
    setShowDefeat,
    showOutro,
    skipVictoryDelay,
    lastRewards,
    setLastRewards,
    handleCloseOutro,
    handleContinue,
  } = useBattleOutro({ redirectTo, onVictory });

  useGameAudio({ src: audioSrc, loop: true, volume: 0.5 });

  const refs = useBattleRefs();
  const targeting = useNpcTargeting();

  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const closeInventoryRef = useRef(closeInventory);
  closeInventoryRef.current = closeInventory;
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;

  const saveDataRef = useRef({
    items: inventoryItems,
    quests,
    character: player.character,
    playerClass,
  });
  saveDataRef.current = {
    items: inventoryItems,
    quests,
    character: player.character,
    playerClass,
  };

  const killCounter = useBattleKillCounter();
  killCounter.npcTypeRef.current = npcType;
  killCounter.npcDataRef.current = npcData;

  const isPaused = showVictory || showDefeat || showIntro || showOutro != null;
  const controlsDisabled = isPaused || isPhaseTransitioning || isGrabbed;

  targeting.npcAiHpRef.current = npcStats.hp;
  targeting.npcAiMaxHpRef.current = npcStats.hp;

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    npcType,
    npcPhaseRef,
    onProjectileHit: () => refs.npcRangedAttackRef.current(),
    onMeleeHit: () => refs.npcMeleeAttackRef.current(),
    isPaused: isPaused || isPhaseTransitioning,
    onSummon: summonNpc,
    onPullPlayer: (npcX: number) => setPlayer((p) => {
      const direction = npcX > p.x ? 1 : -1;
      const pullToX = Math.max(50, Math.min(1200, p.x + direction * 200));
      return {
        ...p,
        pullFromX: p.x,
        pullToX,
        pullStartTime: Date.now(),
      };
    }),
    obstacles: map?.obstacles,
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
    petXRef: targeting.petXRef,
    petYRef: targeting.petYRef,
    hasPetRef: targeting.hasPetRef,
    npcTargetIsPetRef: targeting.npcTargetIsPetRef,
    npcHpRef: targeting.npcAiHpRef,
    npcMaxHpRef: targeting.npcAiMaxHpRef,
    npcBlockedRef: targeting.npcBlockedRef,
    onGrabPlayer: () => {
      setIsGrabbed(true);
      setPlayer((p) => ({ ...p, grabbedUntil: Date.now() + 1500 }));
    },
    onThrowPlayer: () => {
      setIsGrabbed(false);
      setPlayer((p) => ({ ...p, grabbedUntil: 0 }));
      refs.npcThrowAttackRef.current();
    },
  });

  targeting.onBeforeNpcHitRef.current = () => {
    if (npcType !== "piupiu") return false;
    const distanceX = Math.abs(npc.x - player.x);
    const distanceY = Math.abs(npc.y - player.y);
    if (distanceX > 50 || distanceY > 150) return false;
    if (Math.random() < 0.8) {
      targeting.npcBlockedRef.current = true;
      npc.updateNpc({ state: "block" });
      clearTimeout(targeting.npcBlockTimerRef.current);
      targeting.npcBlockTimerRef.current = setTimeout(() => {
        targeting.npcBlockedRef.current = false;
      }, 300);
      return true;
    }
    return false;
  };

  const onPlayerDeathRef = useRef(() => {});
  onPlayerDeathRef.current = () => {
    incrementDeath(player.character);
    handleDefeat();
    recordDefeat();
    setShowDefeat(true);
    const elapsed = Date.now() - battleStartRef.current;
    setDefeatElapsed(elapsed);
    addBattleTime(player.character, Math.floor(elapsed / 1000));
  };

  const onNpcDeathRef = useRef(() => {});
  onNpcDeathRef.current = () => {
    const rewards = giveRewards();
    setLastRewards(rewards);
    reduceHunger(player.character, 5);
    if (rewards.equipmentDrops.length > 0) {
      incrementEquipmentDropsStats(rewards.equipmentDrops.length);
    }
    recordWin(player.character);

    progressDailyWeekly("win_battle", 1);
    progressDailyWeekly("kill_any", 1);

    const npcClass = killCounter.npcDataRef.current.class;
    if (npcClass === "common") progressDailyWeekly("kill_common", 1);
    else if (npcClass === "rare") progressDailyWeekly("kill_rare", 1);
    else if (npcClass === "epic") progressDailyWeekly("kill_epic", 1);
    else if (npcClass === "boss") progressDailyWeekly("kill_boss", 1);

    const d = saveDataRef.current;
    saveGame({
      lastRoute: location.pathname,
      inventory: d.items,
      quests: d.quests,
      playerClass: d.playerClass,
      character: d.character,
    });
    const elapsed = Date.now() - battleStartRef.current;
    setVictoryElapsed(elapsed);
    addBattleTime(player.character, Math.floor(elapsed / 1000));
    saveBestTime(npcType, elapsed);
    setBestTime(loadBestTime(npcType));
    triggerVictory();
    killCounter.handleNpcDeath(
      killCounter.npcTypeRef.current,
      killCounter.npcDataRef.current.class,
    );
  };

  const onBlockRef = useRef(() => {});
  onBlockRef.current = () => {
    incrementBlockCount(player.character);
    incrementBlockCounter();
  };

  const onDamageTakenRef = useRef<(amount: number) => void>(() => {});
  onDamageTakenRef.current = (amount: number) => {
    incrementDamageTaken(amount);
    incrementDamageTakenStats(player.character, amount);
  };

  const onDodgeRef = useRef(() => {});
  onDodgeRef.current = () => {
    incrementDodgeCounter();
    incrementMissesStats(player.character);
  };

  const onDamageDealtRef = useRef<(amount: number) => void>(() => {});
  onDamageDealtRef.current = (amount: number) => {
    incrementDamageDealt(amount);
    incrementDamageDealtStats(player.character, amount);
  };

  const onAttackRef = useRef(() => {});
  onAttackRef.current = () => {
    incrementAttacksUsedStats(player.character);
    incrementHitsUsedStats(player.character);
  };

  const onSpecialRef = useRef(() => {});
  onSpecialRef.current = () => {
    incrementSpecialsUsedStats(player.character);
    incrementHitsUsedStats(player.character);
  };

  const battle = useBattleSystem({
    playerX: player.x,
    playerY: player.y,
    npcX: npc.x,
    npcY: npc.y,
    playerState: player.state,
    npcLevel,
    npcClass: npcData.class,
    npcType,
    difficulty,
    onPlayerDeath: () => onPlayerDeathRef.current(),
    onNpcDeath: () => onNpcDeathRef.current(),
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
    registerHitRef: refs.registerHitRef,
    setPlayer,
    lastBlockPressRef,
    npcPhaseRef,
    npcTargetIsPetRef: targeting.npcTargetIsPetRef,
    petXRef: targeting.petXRef,
    petYRef: targeting.petYRef,
    onBeforeNpcHitRef: targeting.onBeforeNpcHitRef,
    onBlockRef,
    onDamageTakenRef,
    onDodgeRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
    petLevel,
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

  const defeatProgress: number = useMemo(() => {
    if (showDefeat) {
      const totalPhases = npcData.class === "boss" ? 2 : 1;
      const currentPhase = battle.npcPhase ?? 1;
      const completedPhases = Math.max(0, currentPhase - 1);
      const hpProgress = battle.npcMaxHp > 0
        ? (battle.npcMaxHp - battle.npcHP) / battle.npcMaxHp
        : 0;
      const raw = (completedPhases + hpProgress) / totalPhases;
      return Math.min(1, Math.max(0, raw));
    }
    return 0;
  }, [showDefeat, battle.npcHP, battle.npcMaxHp, battle.npcPhase, npcData.class]);

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
    playerHP: battle.playerHP,
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

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

  const npcMaxHpRef = useRef(battle.npcMaxHp);
  npcMaxHpRef.current = battle.npcMaxHp;
  const setNpcHPRef = useRef(battle.setNpcHP);
  setNpcHPRef.current = battle.setNpcHP;
  const isEndingRef = useRef(battle.isEnding);
  isEndingRef.current = battle.isEnding;

  usePhaseTransition({
    npcPhase: battle.npcPhase,
    player,
    setPlayer,
    npc,
    clearSummons,
    setIsPhaseTransitioning,
  });

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
    playerHP: battle.playerHP,
    playerMaxHp: battle.playerMaxHp,
    totalVampirism: battle.totalVampirism,
  });

  useBattleSync({
    battle,
    petXRef: targeting.petXRef,
    petYRef: targeting.petYRef,
    hasPetRef: targeting.hasPetRef,
    npcAiHpRef: targeting.npcAiHpRef,
    npc,
    updateNpcPosition,
    npcType,
    npcMaxHpRef,
    setNpcHPRef,
    isEndingRef,
    setNpcPhase,
    setModeRef,
    closeInventoryRef,
    closeNavbarRef,
    refs,
    charge,
    player,
    battleNpcRangedHit: battle.npcRangedHit,
    battleNpcMeleeHit: battle.npcMeleeHit,
    battleNpcThrowHit: battle.npcThrowHit,
  });

  useBattleControls({
    attack,
    special,
    blockStart: () =>
      setPlayer((p) => {
        if (p.state === "jump") return p;
        return { ...p, state: "blocked" };
      }),
    blockEnd: () =>
      setPlayer((p) => {
        if (p.state !== "blocked") return p;
        return { ...p, state: "idle" };
      }),
    handlePlayerHit,
    handleSpecialHit,
    disabled: controlsDisabled,
    onChargePress: charge.startCharge,
    onChargeRelease: charge.releaseCharge,
    onChargeCancel: charge.cancelCharge,
  });

  function handleRetry() {
    charge.cancelCharge();
    setShowDefeat(false);
    clearSummons();
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
    resetCombo();
    battleStartRef.current = Date.now();
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
    showOutro,
    handleCloseOutro,
    handleRetry,
    handleContinue,
    navigate,
    showIntro,
    skipIntro,
    skipVictoryDelay,
    comboCount,
    comboRank,
    comboProgress: comboProgressValue,
    nextRank,
    charge,
    defeatElapsed,
    victoryElapsed,
    bestTime,
    defeatProgress,
  };
}

import { useRef, useState, useMemo, useEffect } from "react";
import { useGrabThrow } from "@/hooks/battle/useGrabThrow";
import { useThrowAnimation } from "@/hooks/battle/useThrowAnimation";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useAi";
import { useBattleSystem } from "@/hooks/battle/useSystem";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePetProgress } from "@/contexts/PetProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useNavigate, useLocation } from "react-router";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
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
import { useCoffinAnimation } from "@/hooks/battle/useCoffinAnimation";
import { useBattleIntro } from "@/hooks/battle/useIntro";
import { useBattleOutro } from "@/hooks/battle/useOutro";
import { useBattleSync } from "@/hooks/battle/useSync";
import { useNpcTargeting } from "@/hooks/battle/npc/useNpcTargeting";
import { useBattleInfo } from "@/contexts/BattleInfoContext";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { BATTLE_LIMITS } from "@/utils/types/player/movement";
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
    battleTenacityRef,
  } = usePlayer();

  const { progress, reduceHunger, getXPToNextLevel } = useCharacterProgress();
  const playerLevel = progress[player.character]?.level ?? 1;
  const { getPetProgress } = usePetProgress();
  const { getEquippedInfo } = useEquipment();
  const petInfo = getEquippedInfo(player.character, "pet");
  const petLevel = petInfo ? getPetProgress(petInfo.id).level : 1;
  const { items: inventoryItems, closeInventory } = useInventory();
  const { quests, progressDailyWeekly } = useQuests();
  const { closeNavbar, isNavOpen, screen: navScreen } = useNavbar();
  const {
    handleDefeat,
    incrementBlockCounter,
    incrementDamageTaken,
    incrementDamageDealt,
    incrementDodgeCounter,
  } = useTitles();

  const { addBattleTime } = usePlayTime();

  const { playSound } = useSoundEffects();

  const [npcPhase, setNpcPhase] = useState(1);
  const npcPhaseRef = useRef(npcPhase);
  npcPhaseRef.current = npcPhase;
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);

  const battleStartRef = useRef(Date.now());
  const [defeatElapsed, setDefeatElapsed] = useState(0);
  const [victoryElapsed, setVictoryElapsed] = useState(0);
  const [bestTime, setBestTime] = useState(loadBestTime(npcType));

  const { showIntro, skipIntro } = useBattleIntro();

  const { npcData, npcLevel, npcStats } = useNpcSetup(
    npcType,
    difficulty,
    playerLevel,
  );

  const battleInfoCtx = useBattleInfo();
  const battleInfoCtxRef = useRef(battleInfoCtx);
  battleInfoCtxRef.current = battleInfoCtx;

  useEffect(() => {
    battleInfoCtxRef.current?.setBattleInfo({
      npcType,
      npcLevel,
      npcClass: npcData.class,
      npcHp: npcStats.hp,
      npcDamage: npcStats.damage,
      npcArmor: npcStats.armor,
    });
    return () => {
      battleInfoCtxRef.current?.clearBattleInfo();
    };
  }, [
    npcType,
    npcLevel,
    npcData.class,
    npcStats.hp,
    npcStats.damage,
    npcStats.armor,
  ]);

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

  const {
    coffins,
    beginSequence: beginCoffinSequence,
    clearCoffins,
  } = useCoffinAnimation();

  const coffinStartedRef = useRef(false);
  const summonNpcRef = useRef<(npcType: string, overrideX?: number) => void>(
    () => {},
  );
  summonNpcRef.current = summonNpc;

  const onSummonWrapperRef = useRef<(summonType: string) => void>(() => {});
  onSummonWrapperRef.current = (summonType: string) => {
    if (
      npcType === "hungryKing" &&
      npcPhaseRef.current === 2 &&
      summonType === "hungryDeath"
    ) {
      if (!coffinStartedRef.current) {
        coffinStartedRef.current = true;
        playSound("summon");
        beginCoffinSequence(
          [550, 650, 750],
          player.groundY,
          (_npcType: string, x: number) =>
            summonNpcRef.current("hungryDeath", x),
        );
      }
    } else {
      summonNpcRef.current(summonType);
    }
  };

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

  const {
    isGrabbedRef,
    grabFlipped,
    grabFlippedRef,
    isThrown,
    setIsThrown,
    grabbedTimerRef,
    setIsGrabbed,
    onGrabPlayer,
    onThrowStart,
    onThrowPlayer,
  } = useGrabThrow({
    setPlayer,
    npcThrowAttackRef: refs.npcThrowAttackRef,
  });

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

  const isConfigOpen = isNavOpen && navScreen === "config";
  const isPaused =
    showVictory || showDefeat || showIntro || showOutro != null || isConfigOpen;
  const controlsDisabled = isPaused || isPhaseTransitioning || isThrown;

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
    onSummon: onSummonWrapperRef.current,
    onPullPlayer: (npcX: number) =>
      setPlayer((p) => {
        const direction = npcX > p.x ? 1 : -1;
        const pullToX = Math.max(
          BATTLE_LIMITS.minX,
          Math.min(BATTLE_LIMITS.maxX, p.x + direction * 200),
        );
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
    onGrabPlayer,
    onThrowStart,
    onThrowPlayer,
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

  useEffect(() => {
    battleTenacityRef.current = battle.tenacityReduction;
  }, [battle.tenacityReduction, battleTenacityRef]);

  const defeatProgress: number = useMemo(() => {
    if (showDefeat) {
      const totalPhases = npcData.class === "boss" ? 2 : 1;
      const currentPhase = battle.npcPhase ?? 1;
      const completedPhases = Math.max(0, currentPhase - 1);
      const hpProgress =
        battle.npcMaxHp > 0
          ? (battle.npcMaxHp - battle.npcHP) / battle.npcMaxHp
          : 0;
      const raw = (completedPhases + hpProgress) / totalPhases;
      return Math.min(1, Math.max(0, raw));
    }
    return 0;
  }, [
    showDefeat,
    battle.npcHP,
    battle.npcMaxHp,
    battle.npcPhase,
    npcData.class,
  ]);

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
    onNpcPush: (targetX) =>
      npc.updateNpc({
        x: Math.max(BATTLE_LIMITS.minX, Math.min(BATTLE_LIMITS.maxX, targetX)),
      }),
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

  useThrowAnimation({ setPlayer, setIsThrown });

  useBattleControls({
    attack: () => {
      if (isGrabbedRef.current && grabFlippedRef.current) return;
      attack();
    },
    special: () => {
      if (isGrabbedRef.current && grabFlippedRef.current) return;
      if (battle.delicia < battle.hitsToSpecial) return;
      special();
    },
    blockStart: () =>
      setPlayer((p) => {
        if (p.state === "jump" || p.state === "blockAttack") return p;
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
    playerState: player.state,
    onChargePress: charge.startCharge,
    onChargeRelease: charge.releaseCharge,
    onChargeCancel: charge.cancelCharge,
  });

  function handleRetry() {
    charge.cancelCharge();
    setShowDefeat(false);
    clearSummons();
    clearCoffins();
    coffinStartedRef.current = false;
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
    resetCombo();
    battleStartRef.current = Date.now();
    if (grabbedTimerRef.current) clearTimeout(grabbedTimerRef.current);
    grabbedTimerRef.current = null;
    setIsGrabbed(false);
  }

  return {
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    summons,
    coffins,
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
    grabFlipped,
  };
}

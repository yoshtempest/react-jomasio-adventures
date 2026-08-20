import { useRef, useState, useMemo, useEffect, type RefObject } from "react";
import { useGrabThrow } from "@/hooks/battle/throw/useGrabThrow";
import { useThrowAnimation } from "@/hooks/battle/throw/useThrowAnimation";
import { useLatestRef } from "@/hooks/useLatestRef";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useAi";
import { useBattleSystem } from "@/hooks/battle/useSystem";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePetProgress } from "@/contexts/PetProgressContext";
import { petStarsFromEnhance } from "@/data/characters/petProgress";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useNavigate, useLocation } from "react-router";
import {
  useSoundEffects,
  type SoundId,
} from "@/contexts/SoundEffectsContext";
import { logPlay } from "@/utils/replay/audioEventLog";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useTitles } from "@/contexts/TitleContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useNpcSetup } from "@/hooks/battle/npc/useSetup";
import { useBattleRewards } from "@/hooks/battle/rewards/useRewards";
import { useSummons } from "@/hooks/battle/summon/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/summon/useAi";
import { useBattleControls } from "@/hooks/battle/useControls";
import { useComboSystem } from "@/hooks/battle/useComboSystem";
import { useBattleRefs } from "@/hooks/battle/useRefs";
import { useBattleKillCounter } from "@/hooks/battle/death/useKillCounter";
import { useChargeAttack } from "@/hooks/battle/charge/useAttack";
import { usePhaseTransition } from "@/hooks/battle/death/usePhaseTransition";
import { useCoffinAnimation } from "@/hooks/battle/summon/useCoffinAnimation";
import { useBattleIntro } from "@/hooks/battle/useIntro";
import { useBattleOutro } from "@/hooks/battle/useOutro";
import { useBattleSync } from "@/hooks/battle/useSync";
import { useNpcTargeting } from "@/hooks/battle/npc/useNpcTargeting";
import { useBattleInfo } from "@/contexts/BattleInfoContext";
import {
  getPetSkillDefinition,
  type PetSkillDefinition,
} from "@/data/characters/petSkills";
import { getPetBaseDamage } from "@/data/characters/petProgress";
import { calculateDamageToNpc } from "@/gameRules/battle/damage";
import { getElementMultiplier } from "@/gameRules/battle/element";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import { CHARACTERS } from "@/utils/types/player/player";
import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";
import { getLuckBonus } from "@/gameRules/battle/luck";
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
import { useBattleRecording } from "@/hooks/battle/recording/useBattleRecording";
import type { ReplayData } from "@/utils/types/replay";
import type { SpawnDamageFn } from "@/utils/types/battle/spawnDamageFn";

function computeElapsedBattleTime(
  battleStartRef: RefObject<number>,
  prevModeRef: RefObject<PlayerMode>,
  pauseStartRef: RefObject<number>,
  pauseDurationRef: RefObject<number>,
): number {
  let elapsed = Date.now() - battleStartRef.current;
  if (prevModeRef.current === "menu") {
    elapsed += Date.now() - pauseStartRef.current;
  }
  elapsed -= pauseDurationRef.current;
  return elapsed;
}

function buildSummonWrapper(params: {
  npcType: string;
  npcPhaseRef: RefObject<number>;
  coffinStartedRef: RefObject<boolean>;
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
  beginCoffinSequence: (
    spawnPositions: number[],
    groundY: number,
    onSpawn: (npcType: string, x: number) => void,
  ) => void;
  player: Player;
  summonNpcRef: RefObject<(npcType: string, overrideX?: number) => void>;
}): (summonType: string) => void {
  return (summonType: string) => {
    if (
      params.npcType === "hungryKing" &&
      params.npcPhaseRef.current === 2 &&
      summonType === "hungryDeath"
    ) {
      if (!params.coffinStartedRef.current) {
        params.coffinStartedRef.current = true;
        params.playSound("summon");
        logPlay("summon");
        params.beginCoffinSequence(
          [550, 650, 750],
          params.player.groundY,
          (_npcType: string, x: number) =>
            params.summonNpcRef.current("hungryDeath", x),
        );
      }
    } else {
      params.summonNpcRef.current(summonType);
    }
  };
}

function runPetSkill(
  def: PetSkillDefinition,
  deps: {
    petLevel: number;
    petStars: number;
    npcType: string;
    playerX: number;
    playerY: number;
    battle: ReturnType<typeof useBattleSystem>;
    spawnDamageRef: RefObject<SpawnDamageFn>;
    npc: ReturnType<typeof useNpcAI>;
    summonNpc: (npcType: string, overrideX?: number) => void;
    triggerJumpAttack: (npcY: number, cb: (damage: number) => void) => void;
    playSound: (
      sound: SoundId,
      loop?: boolean,
      volumeOverride?: number,
    ) => void;
  },
): void {
  const {
    petLevel,
    petStars,
    npcType,
    playerX,
    playerY,
    battle,
    spawnDamageRef,
    npc,
    summonNpc,
    triggerJumpAttack,
    playSound,
  } = deps;
  const effect = def.skillEffect;
  switch (effect.kind) {
    case "damage": {
      const baseDamage = getPetBaseDamage(petLevel, petStars);
      const elementMultiplier = getElementMultiplier(
        getNpcElementTypes(def.npcType),
        getNpcElementTypes(npcType),
      );
      const dmg = Math.round(
        calculateDamageToNpc(
          baseDamage * effect.multiplier,
          battle.npcArmor,
        ) * elementMultiplier,
      );
      battle.setNpcHP((hp) => Math.max(0, hp - dmg));
      spawnDamageRef.current?.(dmg, npc.x, npc.y, "pet");
      break;
    }
    case "jumpAttack": {
      const baseDamage = getPetBaseDamage(petLevel, petStars);
      const elementMultiplier = getElementMultiplier(
        getNpcElementTypes(def.npcType),
        getNpcElementTypes(npcType),
      );
      const dmg = Math.round(
        calculateDamageToNpc(
          baseDamage * effect.multiplier,
          battle.npcArmor,
        ) * elementMultiplier,
      );
      triggerJumpAttack(npc.y, () => {
        battle.setNpcHP((hp) => Math.max(0, hp - dmg));
        spawnDamageRef.current?.(dmg, npc.x, npc.y, "pet");
      });
      break;
    }
    case "summon":
      summonNpc(effect.npcType);
      break;
    case "shield":
      battle.setPlayerShield((shield) => shield + effect.amount);
      break;
    case "heal":
      battle.setPlayerHP((hp) =>
        Math.min(battle.playerMaxHp, hp + effect.amount),
      );
      spawnDamageRef.current?.(effect.amount, playerX, playerY - 40, "heal");
      break;
    case "healPercent": {
      const pct =
        effect.perStar[petStars - 1] ?? effect.perStar[0] ?? 0;
      const heal = Math.round((battle.playerMaxHp * pct) / 100);
      battle.setPlayerHP((hp) =>
        Math.min(battle.playerMaxHp, hp + heal),
      );
      spawnDamageRef.current?.(heal, playerX, playerY - 40, "heal");
      break;
    }
  }
  playSound("summon");
}

type Props = {
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
  map?: BattleMapConfig;
  background?: string;
  training?: boolean;
  isAlfa?: boolean;
};

export function useBattleScene({
  npcType,
  redirectTo,
  audioSrc,
  onVictory,
  map,
  background,
  training,
  isAlfa = false,
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

  const { progress, reduceHunger, getXPToNextLevel, setBattleHP } =
    useCharacterProgress();
  const playerLevel = progress[player.character]?.level ?? 1;
  const { getPetProgress } = usePetProgress();
  const { getEquippedInfo } = useEquipment();
  const { showHighlight: showHighlightEnabled } = useSettings();
  const petInfo = getEquippedInfo(player.character, "pet");
  const petStars = petInfo ? petStarsFromEnhance(petInfo.enhance) : 1;
  const petLevel = petInfo
    ? getPetProgress(petInfo.id, petStars).level
    : 1;
  const petId = petInfo?.id ?? null;
  const petSkillDef = petId ? getPetSkillDefinition(petId) : null;
  const { items: inventoryItems, closeInventory } = useInventory();
  const { quests, progressDailyWeekly } = useQuests();
  const { closeNavbar, isNavOpen, screen: navScreen } = useNavbar();
  const {
    handleDefeat,
    incrementBlockCounter,
    incrementDamageTaken,
    incrementDamageDealt,
    incrementDodgeCounter,
    incrementPetDropCounter,
  } = useTitles();

  const { addBattleTime } = usePlayTime();

  const { playSound } = useSoundEffects();

  const [npcPhase, setNpcPhase] = useState(1);
  const [npcArmorBonus, setNpcArmorBonus] = useState(0);
  const npcPhaseRef = useLatestRef(npcPhase);
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);

  const battleStartRef = useRef(Date.now());
  const savedPlayerHPRef = useRef(progress[player.character]?.battleHP ?? null);
  const [defeatElapsed, setDefeatElapsed] = useState(0);
  const [victoryElapsed, setVictoryElapsed] = useState(0);
  const [bestTime, setBestTime] = useState(loadBestTime(npcType));

  const prevModeRef = useRef(player.mode);
  const pauseStartRef = useRef(0);
  const pauseDurationRef = useRef(0);

  useEffect(() => {
    if (prevModeRef.current !== "menu" && player.mode === "menu") {
      pauseStartRef.current = Date.now();
    } else if (prevModeRef.current === "menu" && player.mode !== "menu") {
      pauseDurationRef.current += Date.now() - pauseStartRef.current;
    }
    prevModeRef.current = player.mode;
  }, [player.mode]);

  const { showIntro, skipIntro } = useBattleIntro();

  const { npcData, npcLevel, npcStats } = useNpcSetup(
    npcType,
    difficulty,
    playerLevel,
    isAlfa ? 2 : 1,
  );

  const battleInfoCtx = useBattleInfo();
  const battleInfoCtxRef = useLatestRef(battleInfoCtx);

  useEffect(() => {
    const battleInfo = battleInfoCtxRef.current;
    battleInfo?.setBattleInfo({
      npcType,
      npcLevel,
      npcClass: npcData.class,
      npcHp: npcStats.hp,
      npcDamage: npcStats.damage,
      npcArmor: npcStats.armor,
    });
    return () => {
      battleInfo?.clearBattleInfo();
    };
  }, [
    npcType,
    npcLevel,
    npcData.class,
    npcStats.hp,
    npcStats.damage,
    npcStats.armor,
    battleInfoCtxRef,
  ]);

  const equipmentBonus = getEquipmentStatsBonus(player.character);
  const totalLuck =
    progress[player.character].stats.luck + (equipmentBonus.luck ?? 0);
  const luckBonus = getLuckBonus(totalLuck);

  const { xpReward, giveRewards, giveSummonRewards } = useBattleRewards({
    npcClass: npcData.class,
    npcLevel,
    npcType,
    luckBonus,
    isAlfa,
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
  const summonNpcRef = useLatestRef(summonNpc);

  const alfaSummonsSpawnedRef = useRef(false);
  useEffect(() => {
    if (!isAlfa || alfaSummonsSpawnedRef.current) return;
    alfaSummonsSpawnedRef.current = true;
    summonNpc(npcType);
    summonNpc(npcType);
  }, [isAlfa, npcType, summonNpc]);

  const onSummonWrapperRef = useLatestRef(
    buildSummonWrapper({
      npcType,
      npcPhaseRef,
      coffinStartedRef,
      playSound,
      beginCoffinSequence,
      player,
      summonNpcRef,
    }),
  );

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const missingXp = xpNeeded - charProgress.xp;

  const getReplayDataRef = useLatestRef<() => ReplayData | null>(() => null);

  const {
    showVictory,
    triggerVictory,
    showDefeat,
    setShowDefeat,
    showOutro,
    showHighlight,
    highlightData,
    handleCloseHighlight,
    skipVictoryDelay,
    lastRewards,
    setLastRewards,
    handleCloseOutro,
    handleContinue,
  } = useBattleOutro({
    redirectTo,
    onVictory,
    getReplayData: () => getReplayDataRef.current(),
    showHighlightEnabled,
  });

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

  const setModeRef = useLatestRef(setMode);
  const closeInventoryRef = useLatestRef(closeInventory);
  const closeNavbarRef = useLatestRef(closeNavbar);

  const saveDataRef = useLatestRef({
    items: inventoryItems,
    quests,
    character: player.character,
    playerClass,
  });

  const killCounter = useBattleKillCounter();
  if (!training) {
    killCounter.npcTypeRef.current = npcType;
    killCounter.npcDataRef.current = npcData;
  }

  const isConfigOpen = isNavOpen && navScreen === "config";
  const isMenuOpen = isNavOpen;
  const isMenuOpenRef = useLatestRef(isMenuOpen);
  const isPaused =
    showVictory || showDefeat || showIntro || showOutro != null || showHighlight || isConfigOpen;
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
    onPushPlayer: (npcX: number) =>
      setPlayer((p) => {
        const direction = npcX > p.x ? -1 : 1;
        const pushToX = Math.max(
          BATTLE_LIMITS.minX,
          Math.min(BATTLE_LIMITS.maxX, p.x + direction * 200),
        );
        return {
          ...p,
          pullFromX: p.x,
          pullToX: pushToX,
          pullStartTime: Date.now(),
        };
      }),
    onGroundPaperHit: () => battle.npcThrowHit(2),
    onPaperExplode: () => {
      playSound("boom");
    },
    onArmorBuff: (x: number, y: number) => {
      setNpcArmorBonus((b) => b + 1);
      refs.spawnDamageRef.current?.(1, x, y, "armor");
    },
    obstacles: map?.obstacles,
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
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
    refs.spawnDamageRef.current?.(0, npc.x, npc.y, "blocked");
    clearTimeout(targeting.npcBlockTimerRef.current);
      targeting.npcBlockTimerRef.current = setTimeout(() => {
        targeting.npcBlockedRef.current = false;
      }, 300);
      return true;
    }
    return false;
  };

  const onPlayerDeathRef = useLatestRef(() => {
    if (training) {
      battle.resetBattle();
      return;
    }

    const isHardMode = difficulty === "hard" || difficulty === "insano";
    const allOthersDefeated = CHARACTERS.filter((c) => c !== player.character)
      .every((c) => progress[c]?.battleHP === 0);

    if (isHardMode && allOthersDefeated) {
      for (const c of CHARACTERS) {
        setBattleHP(c, 1);
      }
      setMode("explore");
      navigate(-1);
      return;
    }

    setBattleHP(player.character, null);
    incrementDeath(player.character);
    handleDefeat();
    recordDefeat();
    setShowDefeat(true);
    const elapsed = computeElapsedBattleTime(
      battleStartRef,
      prevModeRef,
      pauseStartRef,
      pauseDurationRef,
    );
    setDefeatElapsed(elapsed);
    addBattleTime(player.character, Math.floor(elapsed / 1000));
  });

  const onNpcDeathRef = useLatestRef(() => {
    if (training) {
      battle.setNpcHP(battle.npcMaxHp);
      return;
    }
    setBattleHP(player.character, battle.playerHP);
    const rewards = giveRewards();
    setLastRewards(rewards);
    reduceHunger(player.character, 5);
    if (rewards.equipmentDrops.length > 0) {
      incrementEquipmentDropsStats(rewards.equipmentDrops.length);
    }
    const hasPetDrop = rewards.equipmentDrops.some((d) => d.id.startsWith("pet_"));
    if (hasPetDrop) incrementPetDropCounter();
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
    const elapsed = computeElapsedBattleTime(
      battleStartRef,
      prevModeRef,
      pauseStartRef,
      pauseDurationRef,
    );
    setVictoryElapsed(elapsed);
    addBattleTime(player.character, Math.floor(elapsed / 1000));
    saveBestTime(npcType, elapsed);
    setBestTime(loadBestTime(npcType));
    triggerVictory();
    killCounter.handleNpcDeath(
      killCounter.npcTypeRef.current,
      killCounter.npcDataRef.current.class,
      isAlfa,
    );
  });

  const onBlockRef = useLatestRef(() => {
    incrementBlockCount(player.character);
    incrementBlockCounter();
  });

  const onDamageTakenRef = useLatestRef((amount: number) => {
    incrementDamageTaken(amount);
    incrementDamageTakenStats(player.character, amount);
  });

  const onDodgeRef = useLatestRef(() => {
    incrementDodgeCounter();
    incrementMissesStats(player.character);
  });

  const onDamageDealtRef = useLatestRef((amount: number) => {
    incrementDamageDealt(amount);
    incrementDamageDealtStats(player.character, amount);
  });

  const onAttackRef = useLatestRef(() => {
    incrementAttacksUsedStats(player.character);
    incrementHitsUsedStats(player.character);
  });

  const onSpecialRef = useLatestRef(() => {
    incrementSpecialsUsedStats(player.character);
    incrementHitsUsedStats(player.character);
  });

  const executePetSkillRef = useRef<() => void>(() => {});

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
    onBeforeNpcHitRef: targeting.onBeforeNpcHitRef,
    onBlockRef,
    onDamageTakenRef,
    onDodgeRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
    petId,
    onPetSkillRef: executePetSkillRef,
    isMenuRef: isMenuOpenRef,
    savedPlayerHP: savedPlayerHPRef.current,
    npcStatMultiplier: isAlfa ? 2 : 1,
    npcArmorBonus,
  });

  executePetSkillRef.current = () => {
    if (!petSkillDef || battle.isEnding.current) return;
    runPetSkill(petSkillDef, {
      petLevel,
      petStars,
      npcType,
      playerX: player.x,
      playerY: player.y,
      battle,
      spawnDamageRef: refs.spawnDamageRef,
      npc,
      summonNpc,
      triggerJumpAttack: battle.triggerJumpAttack,
      playSound,
    });
  };

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

  const playerSnapshotRef = useLatestRef({
    x: player.x,
    y: player.y,
    state: player.state,
    battleDirection: player.battleDirection,
    character: player.character,
    direction: player.direction,
    grabbedUntil: player.grabbedUntil ?? 0,
  });

  const npcSnapshotRef = useLatestRef({
    x: npc.x,
    y: npc.y,
    state: npc.state,
    direction: npc.direction,
    jumpLandingX: npc.jumpLandingX,
  });

  const battleSnapshotRef = useLatestRef({
    playerHP: battle.playerHP,
    playerMaxHp: battle.playerMaxHp,
    playerShield: battle.playerShield,
    npcHP: battle.npcHP,
    npcMaxHp: battle.npcMaxHp,
    npcPhase: battle.npcPhase ?? 1,
    delicia: battle.delicia,
    hitsToSpecial: battle.hitsToSpecial,
    blockGauge: battle.blockGauge,
    blockLimit: battle.blockLimit,
  });

  const petData = battle.pet;
  const petSnapshotRef = useLatestRef(petData);

  const COMBO_ACTION_STATES: Partial<Record<PlayerState, string>> = {
    blocked: "blockAttack",
    falling: "fallingAttack",
  };
  const comboActionSprite =
    !controlsDisabled && player.state in COMBO_ACTION_STATES
      ? (COMBO_ACTION_STATES[player.state] ?? null)
      : null;
  const comboActionRef = useLatestRef(comboActionSprite);

  const comboSnapshotRef = useLatestRef({
    count: comboCount,
    rank: comboRank,
    progress: comboProgressValue,
    nextRank,
  });

  const damageNumbersSnapshotRef = useLatestRef(battle.damageNumbers);

  const summonsSnapshotRef = useLatestRef(summons);

  const { isRecording, startRecording, stopRecording, getReplayData } =
    useBattleRecording({
      playerRef: playerSnapshotRef,
      npcRef: npcSnapshotRef,
      battleRef: battleSnapshotRef,
      damageNumbersRef: damageNumbersSnapshotRef,
      summonsRef: summonsSnapshotRef,
      petRef: petSnapshotRef,
      comboRef: comboSnapshotRef,
      comboActionRef,
      npcType: training ? "__training" : npcType,
      npcLevel,
      npcClass: npcData.class,
      playerCharacter: player.character,
      playerLevel,
      background: background ?? "",
      audioSrc,
    });

  const wasIntroActiveRef = useRef(showIntro);

  useEffect(() => {
    if (wasIntroActiveRef.current && !showIntro) {
      startRecording();
    }
    wasIntroActiveRef.current = showIntro;
  }, [showIntro, startRecording]);

  useEffect(() => {
    if ((showVictory || showDefeat) && isRecording) {
      stopRecording();
    }
  }, [showVictory, showDefeat, isRecording, stopRecording]);

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
    npcClass: npcData.class,
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
    playerCharacter: player.character,
    npcLevel,
    difficulty,
    damagePlayer: battle.damagePlayer,
    spawnDamageRef: refs.spawnDamageRef,
    hitstopRef: refs.hitstopRef,
  });

  const npcMaxHpRef = useLatestRef(battle.npcMaxHp);
  const setNpcHPRef = useLatestRef(battle.setNpcHP);
  const isEndingRef = useLatestRef(battle.isEnding);

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
    npcType,
    npcArmor: battle.npcArmor,
    npcClass: npcData.class,
    char: battle.char,
    playerClass,
    critRate: battle.critRate,
    titleDamageBonus: battle.titleDamageBonus,
    elementDamageBonus: battle.elementDamageBonus,
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
    halfHealReduction: battle.halfHealReduction,
    battleNpcRangedHit: battle.npcRangedHit,
    battleNpcMeleeHit: battle.npcMeleeHit,
    battleNpcThrowHit: battle.npcThrowHit,
  });

  useThrowAnimation({ setPlayer, setIsThrown, isMenuRef: isMenuOpenRef });

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

  const npcMaxHpForRegen = battle.npcMaxHp;
  const setNpcHpForRegen = battle.setNpcHP;
  useEffect(() => {
    if (!training) return;
    const id = setInterval(() => {
      setNpcHpForRegen((hp) => {
        const next = hp + npcMaxHpForRegen * 0.5;
        return next > npcMaxHpForRegen ? npcMaxHpForRegen : next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [training, npcMaxHpForRegen, setNpcHpForRegen]);

  function handleRetry() {
    charge.cancelCharge();
    setShowDefeat(false);
    clearSummons();
    clearCoffins();
    coffinStartedRef.current = false;
    if (isAlfa) {
      summonNpc(npcType);
      summonNpc(npcType);
    }
    battle.resetBattle();
    npc.resetNpc();
    resetBattleState();
    resetCombo();
    battleStartRef.current = Date.now();
    pauseDurationRef.current = 0;
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
    petSkill: battle.petSkill,
    charProgress,
    missingXp,
    xpReward,
    lastRewards,
    showVictory,
    showDefeat,
    showOutro,
    showHighlight,
    highlightData,
    handleCloseHighlight,
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
    getReplayData,
    isRecording,
    training,
    controlsDisabled,
    showRetry: difficulty !== "hard" && difficulty !== "insano",
  };
}

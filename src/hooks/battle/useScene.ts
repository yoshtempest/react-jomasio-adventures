import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type RefObject,
} from "react";
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
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useBattleNavbar } from "@/contexts/BattleNavbarContext";
import { useTitles } from "@/contexts/TitleContext";
import { usePlayTimeActions } from "@/contexts/PlayTimeContext";
import { useSettings } from "@/hooks/useSetting";
import { useTombstones } from "@/contexts/TombstoneContext";
import { useNpcSetup } from "@/hooks/battle/npc/useSetup";
import { useBattleRewards } from "@/hooks/battle/rewards/useRewards";
import { useSummons } from "@/hooks/battle/summon/useSummons";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/summon/useAi";
import { useAllies } from "@/hooks/battle/summon/useAllies";
import { useAllyAI } from "@/hooks/battle/summon/useAllyAI";
import { useBattleControls } from "@/hooks/battle/useControls";
import { useComboSystem } from "@/hooks/battle/useComboSystem";
import { useBattleRefs } from "@/hooks/battle/useRefs";
import { useBattleKillCounter } from "@/hooks/battle/death/useKillCounter";
import { useChargeAttack } from "@/hooks/battle/charge/useAttack";
import {
  getWeaponEnchantment,
  rollEnchantmentProc,
} from "@/gameRules/battle/equipment";
import {
  ENCHANTMENTS,
  ENCHANTMENT_DURATION_MS,
  ENCHANTMENT_TICK_DAMAGE,
  ENCHANTMENT_TICK_INTERVAL_MS,
  type Enchantment,
} from "@/data/equipment/enchantments";
import { usePhaseTransition } from "@/hooks/battle/death/usePhaseTransition";
import { useCoffinAnimation } from "@/hooks/battle/summon/useCoffinAnimation";
import { usePlayerSpecialProjectile } from "@/hooks/battle/player/usePlayerSpecialProjectile";
import { useArturKillerQueen } from "@/hooks/battle/player/characters/srGuaxinim/useArturKillerQueen";
import { useArturOraPunch } from "@/hooks/battle/player/characters/srGuaxinim/useArturOraPunch";
import { playerPath } from "@/utils/paths";
import { getSpecialFlowOverride } from "@/data/battle/animationFlow";
import { CHARGE_ATTACK_MIN_LEVEL } from "@/data/battle/charge";
import { useBattleIntro } from "@/hooks/battle/useIntro";
import { useBattleOutro } from "@/hooks/battle/useOutro";
import { useBattleSync } from "@/hooks/battle/useSync";
import { useNpcTargeting } from "@/hooks/battle/npc/useNpcTargeting";
import { useBattleInfo } from "@/contexts/BattleInfoContext";
import {
  getPetSkillDefinition,
  PET_ROOT_DURATION_MS,
} from "@/data/characters/petSkills";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import { CHARACTERS } from "@/data/characters/list";
import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";
import { saveGame } from "@/services/save/saveService";
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
import { useRewind } from "@/hooks/battle/rewind/useRewind";
import { runPetSkill } from "@/gameRules/battle/petSkill/petSkill";
import { buildSummonWrapper } from "@/gameRules/battle/petSkill/buildSummonWrapper";
import type { ReplayData, ReplayFrame } from "@/utils/types/replay";
import { combatService } from "@/services/combat";
import {
  applyPlayerStatus,
  DOT_TICK_INTERVAL_MS,
} from "@/gameRules/battle/status/statusEffects";
import type { NewPlayerStatus } from "@/gameRules/battle/status/statusEffects";
import { useKokusenAnimation } from "@/hooks/battle/player/characters/Natsuki/useKokusenAnimation";
import { useSpecialIntro } from "@/hooks/battle/useSpecialIntro";
import type { BattleSceneApi } from "@/utils/types/battle/scene";

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


type Props = {
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
  map?: BattleMapConfig;
  background?: string;
  training?: boolean;
  isAlfa?: boolean;
  PLAYER_SIZE: number;
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
  PLAYER_SIZE,
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
    lastAttackPressRef,
    battleTenacityRef,
    freezeActionsUntilRef,
    setTimeScale,
    resetTimeScale,
    timeScaleRef,
  } = usePlayer();

  const { progress, reduceHunger, getXPToNextLevel, setBattleHP } =
    useCharacterProgress();
  const playerLevel = progress[player.character]?.level ?? 1;
  const { getPetProgress } = usePetProgress();
  const { getEquippedInfo } = useEquipment();
  const { showHighlight: showHighlightEnabled } = useSettings();
  const petInfo = getEquippedInfo(player.character, "pet");
  const petStars = petInfo ? petStarsFromEnhance(petInfo.enhance) : 1;
  const petLevel = petInfo ? getPetProgress(petInfo.id, petStars).level : 1;
  const petId = petInfo?.id ?? null;
  const petSkillDef = petId ? getPetSkillDefinition(petId) : null;
  const { items: inventoryItems, closeInventory } = useInventory();
  const { quests, progressDailyWeekly } = useQuests();
  const { closeNavbar, isNavOpen, screen: navScreen } = useNavbar();
  const { isBattleNavOpen } = useBattleNavbar();
  const {
    handleDefeat,
    incrementBlockCounter,
    incrementDamageTaken,
    incrementDamageDealt,
    incrementDodgeCounter,
    incrementPetDropCounter,
  } = useTitles();

  const { addBattleTime } = usePlayTimeActions();

  const { playSound } = useSoundEffects();
  const { spawnVictoryTombstone, clearPendingTombstoneSpawn } = useTombstones();

  const [npcPhase, setNpcPhase] = useState(1);
  const [npcArmorBonus, setNpcArmorBonus] = useState(0);
  const npcPhaseRef = useLatestRef(npcPhase);
  const [isPhaseTransitioning, setIsPhaseTransitioning] = useState(false);

  const battleStartRef = useRef(Date.now());
  const savedPlayerHPRef = useRef(progress[player.character]?.battleHP ?? null);
  const [rewindFrames, setRewindFrames] = useState<ReplayFrame[] | null>(null);
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
  const luckBonus = combatService.getLuckBonus(totalLuck);

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

  const summonsBleedUntilRef = useRef<Record<string, number>>({});

  const { allies, setAllies, summonAlly, clearAllies } = useAllies({
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

  const { kokusenActive, kokusenFrame, triggerKokusen } = useKokusenAnimation();
  const onKokusenRef = useLatestRef(triggerKokusen);

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
  const { resetBattleNavbar } = useBattleNavbar();
  const resetBattleNavbarRef = useLatestRef(resetBattleNavbar);

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
  const isMenuOpen = isNavOpen || isBattleNavOpen;
  const isMenuOpenRef = useLatestRef(isMenuOpen);
  const isPaused =
    showVictory ||
    showDefeat ||
    showIntro ||
    showOutro != null ||
    showHighlight ||
    rewindFrames != null ||
    isConfigOpen ||
    isBattleNavOpen;
  const isPausedRef = useLatestRef(isPaused);
  const controlsDisabled = isPaused || isPhaseTransitioning || isThrown;

  targeting.npcAiHpRef.current = npcStats.hp;
  targeting.npcAiMaxHpRef.current = npcStats.hp;

  const npcRootedUntilRef = useRef(0);
  const rootedSummonsUntilRef = useRef<Record<string, number>>({});

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
    onPaperExplode: () => {},
    onArmorBuff: (x: number, y: number) => {
      playSound("shieldStack");
      setNpcArmorBonus((b) => b + 1);
      refs.spawnDamageRef.current?.(1, x, y, "armor");
    },
    onLaserHit: () => {
      battle.npcFixedHit(1);
    },
    onStuckPaperExplode: () => {
      battle.npcUnblockableHit(2);
      playSound("explosion");
    },
    onApplyDebuff: (status: NewPlayerStatus) => {
      setPlayer((p) => applyPlayerStatus(p, status));
    },
    obstacles: map?.obstacles,
    hitstopRef: refs.hitstopRef,
    npcStaggerRef: refs.npcStaggerRef,
    rootedUntilRef: npcRootedUntilRef,
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

  const performRewindRef = useRef<() => boolean>(() => false);

  const onPlayerDeathRef = useLatestRef(() => {
    if (rewindFrames != null) {
      battle.isEnding.current = true;
      return;
    }

    if (training) {
      battle.resetBattle();
      return;
    }

    if (performRewindRef.current()) {
      battle.isEnding.current = true;
      return;
    }

    const isHardMode = difficulty === "hard" || difficulty === "insano";
    const allOthersDefeated = CHARACTERS.filter(
      (c) => c !== player.character,
    ).every((c) => progress[c]?.battleHP === 0);

    if (isHardMode && allOthersDefeated) {
      for (const c of CHARACTERS) {
        setBattleHP(c, 1);
      }
      setMode("explore");
      void navigate(-1);
      return;
    }

    setBattleHP(player.character, null);
    incrementDeath(player.character);
    handleDefeat();
    recordDefeat();
    clearPendingTombstoneSpawn();
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
    const hasPetDrop = rewards.equipmentDrops.some((d) =>
      d.id.startsWith("pet_"),
    );
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
    spawnVictoryTombstone(npcType);
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

  // Preenchido pelo useArturOraPunch com o multiplicador atual (escala ORA).
  const arturOraMultiplierRef = useRef<() => number>(() => 1);

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
    lastAttackPressRef,
    npcPhaseRef,
    onBeforeNpcHitRef: targeting.onBeforeNpcHitRef,
    onBlockRef,
    onDamageTakenRef,
    onDodgeRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
    onKokusenRef,
    arturOraMultiplierRef,
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
      playerLevel,
      groundY: player.groundY,
      beginCoffinSequence,
      npcType,
      playerX: player.x,
      playerY: player.y,
      battle,
      spawnDamageRef: refs.spawnDamageRef,
      npc,
      summonAlly,
      triggerJumpAttack: battle.triggerJumpAttack,
      triggerTeleportBite: battle.triggerTeleportBite,
      applyNpcBleed: battle.applyNpcBleed,
      summons,
      setSummons,
      summonsBleedUntilRef,
      npcRootedUntilRef,
      rootedSummonsUntilRef,
      rootDurationMs: PET_ROOT_DURATION_MS,
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
  const weaponInfo = getEquippedInfo(player.character, "weapon");
  const weaponEnchantment = weaponInfo
    ? getWeaponEnchantment(weaponInfo.id)
    : null;
  const weaponEnchantmentRef = useLatestRef(weaponEnchantment);

  /** Fim de cada status aplicado pelo encantamento da arma no NPC. */
  const npcEnchantUntilRef = useRef<Record<Enchantment, number>>({
    burn: 0,
    freeze: 0,
    poison: 0,
    bleed: 0,
  });

  refs.registerHitRef.current = (damage: number) => {
    registerHit(damage);

    const enchantment = weaponEnchantmentRef.current;
    if (!rollEnchantmentProc(enchantment) || !enchantment) return;

    const until = Date.now() + ENCHANTMENT_DURATION_MS[enchantment];
    npcEnchantUntilRef.current[enchantment] = until;

    if (enchantment === "freeze") {
      refs.npcStaggerRef.current = Math.max(
        refs.npcStaggerRef.current,
        until,
      );
    }

    refs.spawnDamageRef.current?.(0, npc.x, npc.y, enchantment);
  };
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

  const npcProjectilesSnapshotRef = useLatestRef(npc.projectiles);

  const {
    isRecording,
    startRecording,
    stopRecording,
    getReplayData,
    getReplayWindow,
  } = useBattleRecording({
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

  const { reset: resetRewind } = useRewind({
    character: player.character,
    rewindFrames,
    setRewindFrames,
    performRewindRef,
    setPlayer,
    setNpcPhase,
    setSummons,
    playerSnapshotRef,
    npcSnapshotRef,
    battleSnapshotRef,
    npcProjectilesSnapshotRef,
    summonsSnapshotRef,
    battle,
    npc,
    resetCombo,
    getReplayWindow,
  });

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

  const { handlePlayerHit, handleSpecialHit, handleExtraPunch, hitTargetList } =
    usePlayerBattleActions({
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
          x: Math.max(
            BATTLE_LIMITS.minX,
            Math.min(BATTLE_LIMITS.maxX, targetX),
          ),
        }),
    });

  const freezeSummonsUntilRef = useRef(0);

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
    freezeUntilRef: freezeSummonsUntilRef,
    rootedSummonsUntilRef,
  });

  useAllyAI({
    allies,
    setAllies,
    enemySummons: summons,
    setEnemySummons: setSummons,
    isPaused,
    isEnding: battle.isEnding.current,
    enemyNpc: { x: npc.x, y: npc.y, npcType },
    npcHp: battle.npcHP,
    npcArmor: battle.npcArmor,
    setNpcHP: battle.setNpcHP,
    npcLevel,
    difficulty,
    spawnDamageRef: refs.spawnDamageRef,
    hitstopRef: refs.hitstopRef,
  });

  const arturEnemies = useMemo(() => {
    if (player.character !== "artur") return [];
    return [
      { id: "main", x: npc.x, y: npc.y },
      ...summons
        .filter((s) => !s.isDying && s.hp > 0)
        .map((s) => ({ id: s.id, x: s.x, y: s.y })),
    ];
  }, [player.character, npc.x, npc.y, summons]);

  const { oraPress, oraRelease, punches: extraPunches } = useArturOraPunch({
    player,
    setPlayer,
    onPunchHit: handleExtraPunch,
    multiplierRef: arturOraMultiplierRef,
  });

  const extraPunchSprite = playerPath("/artur/inFight/attacks/extraPunch.svg");

  const {
    killerQueen,
    bombTargets,
    killerQueenSprite,
    bombSprite,
    explosionSprite,
  } = useArturKillerQueen({
    player,
    setPlayer,
    enemies: arturEnemies,
    freezeMainUntilRef: refs.npcStaggerRef,
    freezeSummonsUntilRef,
    freezePlayerUntilRef: freezeActionsUntilRef,
    onAreaDamage: (explosions, allEnemies) => {
      for (const enemy of allEnemies) {
        const count = explosions.filter(
          (c) => Math.hypot(enemy.x - c.x, enemy.y - c.y) <= 200,
        ).length;
        if (count > 0) {
          hitTargetList(
            [{ id: enemy.id, x: enemy.x, y: enemy.y }],
            count,
            true,
          );
        }
      }
    },
  });

  const npcMaxHpRef = useLatestRef(battle.npcMaxHp);
  const setNpcHPRef = useLatestRef(battle.setNpcHP);
  const isEndingRef = useLatestRef(battle.isEnding);

  const summonsRef = useLatestRef(summons);
  useEffect(() => {
    const interval = setInterval(() => {
      if (isEndingRef.current || isPausedRef.current) return;
      const bleedMap = summonsBleedUntilRef.current;
      if (
        !summonsRef.current.some((s) => (bleedMap[s.id] ?? 0) > Date.now())
      ) {
        return;
      }

      const bleeding = summonsRef.current.filter(
        (s) => (bleedMap[s.id] ?? 0) > Date.now(),
      );
      setSummons((prev) =>
        prev.map((s) =>
          (bleedMap[s.id] ?? 0) > Date.now()
            ? { ...s, hp: Math.max(0, s.hp - 2) }
            : s,
        ),
      );
      for (const s of bleeding) {
        refs.spawnDamageRef.current?.(2, s.x, s.y, "bleed");
      }

      const now = Date.now();
      for (const id of Object.keys(bleedMap)) {
        const until = bleedMap[id];
        if (until !== undefined && until <= now) delete bleedMap[id];
      }
    }, DOT_TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [setSummons, isEndingRef, isPausedRef, summonsRef, summonsBleedUntilRef, refs]);

  /**
   * Dano contínuo dos status aplicados pelo encantamento da arma.
   *
   * `freeze` não tem tick de dano: o efeito dele é manter o NPC parado, o que
   * já acontece via `npcStaggerRef`.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (isEndingRef.current || isPausedRef.current) return;

      const now = Date.now();
      let total = 0;
      let lastType: Enchantment | null = null;

      for (const enchantment of ENCHANTMENTS) {
        if (npcEnchantUntilRef.current[enchantment] <= now) continue;
        const tick = ENCHANTMENT_TICK_DAMAGE[enchantment];
        if (tick <= 0) continue;
        total += tick;
        lastType = enchantment;
      }

      if (total <= 0 || !lastType) return;

      setNpcHPRef.current((hp) => Math.max(0, hp - total));
      const snapshot = npcSnapshotRef.current;
      refs.spawnDamageRef.current?.(total, snapshot.x, snapshot.y, lastType);
    }, ENCHANTMENT_TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isEndingRef, isPausedRef, setNpcHPRef, refs, npcSnapshotRef]);

  usePhaseTransition({
    npcPhase: battle.npcPhase,
    player,
    setPlayer,
    npc,
    clearSummons,
    clearAllies,
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
    isPausedRef,
    resetBattleNavbarRef,
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

  const { playerProjectile } = usePlayerSpecialProjectile({
    player,
    PLAYER_SIZE,
    onFire: handleSpecialHit,
    timeScaleRef,
    setTimeScale,
  });

  const { specialIntroActive, specialIntroCharacter, startSpecialIntro } =
    useSpecialIntro({ setTimeScale, resetTimeScale });

  const skipSpecialHitOnPress =
    getSpecialFlowOverride(player.character) !== null;

  // Artur não usa o charge (segurar onConfirm = ORA ORA). Os demais mantêm.
  const canCharge =
    player.character !== "artur" && playerLevel >= CHARGE_ATTACK_MIN_LEVEL;

  const activateSpecial = useCallback(() => {
    if (freezeActionsUntilRef.current > Date.now()) return;
    if (isGrabbedRef.current && grabFlippedRef.current) return;
    special();
    if (!skipSpecialHitOnPress) {
      handleSpecialHit();
    }
  }, [
    freezeActionsUntilRef,
    isGrabbedRef,
    grabFlippedRef,
    special,
    handleSpecialHit,
    skipSpecialHitOnPress,
  ]);

  const openSpecial = useCallback(() => {
    if (freezeActionsUntilRef.current > Date.now()) return;
    if (isGrabbedRef.current && grabFlippedRef.current) return;
    if (battle.delicia < battle.hitsToSpecial) return;
    startSpecialIntro(player.character, activateSpecial);
  }, [
    freezeActionsUntilRef,
    isGrabbedRef,
    grabFlippedRef,
    battle.delicia,
    battle.hitsToSpecial,
    startSpecialIntro,
    player.character,
    activateSpecial,
  ]);

  useBattleControls({
    attack: () => {
      if (freezeActionsUntilRef.current > Date.now()) return;
      if (isGrabbedRef.current && grabFlippedRef.current) return;
      attack();
      oraPress();
    },
    special: () => {
      if (freezeActionsUntilRef.current > Date.now()) return;
      if (isGrabbedRef.current && grabFlippedRef.current) return;
      if (battle.delicia < battle.hitsToSpecial) return;
      special();
    },
    blockStart: () => {
      if (freezeActionsUntilRef.current > Date.now()) return;
      if (player.state !== "blocked") {
        lastBlockPressRef.current = Date.now();
      }
      setPlayer((p) => {
        if (p.state === "jump" || p.state === "blockAttack") return p;
        return { ...p, state: "blocked" };
      });
    },
    blockEnd: () =>
      setPlayer((p) => {
        if (p.state !== "blocked") return p;
        return { ...p, state: "idle" };
      }),
    handlePlayerHit: () => {
      if (freezeActionsUntilRef.current > Date.now()) return;
      handlePlayerHit();
    },
    handleSpecialHit: () => {
      if (freezeActionsUntilRef.current > Date.now()) return;
      handleSpecialHit();
    },
    disabled: controlsDisabled,
    playerState: player.state,
    skipSpecialHitOnPress,
    openSpecial,
    onChargePress: canCharge
      ? () => {
          if (freezeActionsUntilRef.current > Date.now()) return;
          charge.startCharge();
        }
      : undefined,
    onChargeRelease: canCharge
      ? () => {
          if (freezeActionsUntilRef.current > Date.now()) return;
          charge.releaseCharge();
        }
      : undefined,
    onChargeCancel: canCharge
      ? () => {
          if (freezeActionsUntilRef.current > Date.now()) return;
          charge.cancelCharge();
        }
      : undefined,
    onComboRelease: oraRelease,
  });

  const npcMaxHpForRegen = battle.npcMaxHp;
  const setNpcHpForRegen = battle.setNpcHP;
  useEffect(() => {
    if (!training) return;
    const id = setInterval(() => {
      if (isPausedRef.current) return;
      setNpcHpForRegen((hp) => {
        const next = hp + npcMaxHpForRegen * 0.5;
        return next > npcMaxHpForRegen ? npcMaxHpForRegen : next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [training, npcMaxHpForRegen, setNpcHpForRegen, isPausedRef]);

  function handleRetry() {
    charge.cancelCharge();
    resetRewind();
    setShowDefeat(false);
    clearSummons();
    clearAllies();
    clearCoffins();
    coffinStartedRef.current = false;
    npcRootedUntilRef.current = 0;
    npcEnchantUntilRef.current = { burn: 0, freeze: 0, poison: 0, bleed: 0 };
    rootedSummonsUntilRef.current = {};
    summonsBleedUntilRef.current = {};
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
    allies,
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
    playerProjectile,
    killerQueen,
    bombTargets,
    killerQueenSprite,
    bombSprite,
    explosionSprite,
    extraPunches,
    extraPunchSprite,
    kokusenActive,
    kokusenFrame,
    specialIntroActive,
    specialIntroCharacter,
  } satisfies BattleSceneApi;
}

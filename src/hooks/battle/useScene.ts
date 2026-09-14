import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useGrabThrow } from "@/hooks/battle/throw/useGrabThrow";
import { useThrowAnimation } from "@/hooks/battle/throw/useThrowAnimation";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useGameAudio } from "@/hooks/game/useGameAudio";
import { useNpcAI } from "@/hooks/battle/npc/useAi";
import { useBattleSystem } from "@/hooks/battle/useSystem";
import { useNavigate, useLocation } from "react-router";
import { useBattleNavbar } from "@/contexts/BattleNavbarContext";
import { useNpcTargeting } from "@/hooks/battle/npc/useNpcTargeting";
import { useBattleMana } from "@/contexts/BattleManaContext";
import { useBattleLoot } from "@/hooks/battle/loot/useBattleLoot";
import { useLootNotifications } from "@/hooks/battle/loot/useLootNotifications";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/summon/useAi";
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
import { aggregateRewards } from "@/gameRules/battle/loot/buildLootBags";
import { ENCHANTMENT_DURATION_MS, type Enchantment } from "@/data/equipment/enchantments";
import { usePhaseTransition } from "@/hooks/battle/death/usePhaseTransition";
import { usePlayerSpecialProjectile } from "@/hooks/battle/player/usePlayerSpecialProjectile";
import { useLucasWeaponSwitch } from "@/hooks/battle/player/characters/lucas/useLucasWeaponSwitch";
import { getSpecialFlowOverride } from "@/data/battle/animationFlow";
import { CHARGE_ATTACK_MIN_LEVEL } from "@/data/battle/charge";
import { useBattleOutro } from "@/hooks/battle/useOutro";
import { useBattleSync } from "@/hooks/battle/useSync";
import { useBattleStageSetup } from "@/hooks/battle/useBattleStageSetup";
import { LUCAS_WEAPON_SWITCH_MANA_COST } from "@/gameRules/battle/mana";
import { cursedEnergyFromDamage } from "@/gameRules/battle/cursedEnergy";
import { PET_ROOT_DURATION_MS } from "@/data/characters/petSkills";
import type { BattleMapConfig } from "@/utils/types/maps/battle";
import {
  BATTLE_LIMITS,
  BLOCK_ATTACK_PUSH_DISTANCE,
} from "@/gameRules/movement/constants";
import { CHARACTERS } from "@/data/characters/list";
import { saveGame } from "@/services/save/saveService";
import { loadBestTime, saveBestTime } from "@/utils/bestTime";
import { recordWin } from "@/utils/rewards/streakStats";
import { useBattleRecording } from "@/hooks/battle/recording/useBattleRecording";
import { useRewind } from "@/hooks/battle/rewind/useRewind";
import { runPetSkill } from "@/gameRules/battle/petSkill/petSkill";
import {
  applyPlayerStatus,
} from "@/gameRules/battle/status/statusEffects";
import type { NewPlayerStatus } from "@/gameRules/battle/status/statusEffects";
import { useKokusenAnimation } from "@/hooks/battle/player/characters/Natsuki/useKokusenAnimation";
import {
  useBlackFlashAnimation,
  BLACK_FLASH_TIME_SCALE,
} from "@/hooks/battle/player/characters/Natsuki/useBlackFlashAnimation";
import { useBlinkAnimation } from "@/hooks/battle/player/characters/Natsuki/useBlinkAnimation";
import { useDivergentFistAnimation } from "@/hooks/battle/player/characters/Natsuki/useDivergentFistAnimation";
import {
  useVastolordForm,
  VASTOLORD_MULTIPLIER,
  VASTOLORD_DURATION_MS,
} from "@/hooks/battle/player/characters/marcelo/useVastolordForm";
import { getCharacterPassive } from "@/data/characters/passives";
import { useSpecialIntro } from "@/hooks/battle/useSpecialIntro";
import type { LootBagContents } from "@/utils/types/battle/loot";
import { computeElapsedBattleTime } from "@/hooks/battle/computeElapsedBattleTime";
import { useStatCallbacks } from "@/hooks/battle/useStatCallbacks";
import { useBattleSnapshots } from "@/hooks/battle/useBattleSnapshots";
import { useActiveSkills } from "@/hooks/battle/useActiveSkills";
import { useStatusDots } from "@/hooks/battle/useStatusDots";
import { useTrainingEffects } from "@/hooks/battle/useTrainingEffects";
import { useHonoredOne } from "@/hooks/battle/useHonoredOne";
import { useDefeatFlow } from "@/hooks/battle/useDefeatFlow";
import { useArturBattle } from "@/hooks/battle/useArturBattle";
import { buildBattleSceneApi } from "@/hooks/battle/buildBattleSceneApi";

type Props = {
  npcType: string;
  redirectTo?: string;
  audioSrc: string;
  onVictory?: () => void;
  map?: BattleMapConfig;
  background?: string;
  training?: boolean;
  isAlfa?: boolean;
  npcLevel?: number;
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
  npcLevel: npcLevelProp,
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
    forcePunchRef,
    setTimeScale,
    resetTimeScale,
    timeScaleRef,
    honoredRiseStartRef,
    honoredRiseStartYRef,
    honoredFallRef,
    progress,
    reduceHunger,
    setBattleHP,
    setBattleMana,
    playerLevel,
    getEquippedInfo,
    showHighlightEnabled,
    petStars,
    petLevel,
    petId,
    petSkillDef,
    inventoryItems,
    closeInventory,
    quests,
    progressDailyWeekly,
    closeNavbar,
    isNavOpen,
    navScreen,
    isBattleNavOpen,
    handleDefeat,
    incrementBlockCounter,
    incrementDamageTaken,
    incrementDamageDealt,
    incrementDodgeCounter,
    addBattleTime,
    playSound,
    spawnVictoryTombstone,
    clearPendingTombstoneSpawn,
    setNpcPhase,
    npcArmorBonus,
    setNpcArmorBonus,
    npcPhaseRef,
    isPhaseTransitioning,
    setIsPhaseTransitioning,
    battleStartRef,
    savedPlayerHPRef,
    rewindFrames,
    setRewindFrames,
    victoryElapsed,
    setVictoryElapsed,
    bestTime,
    setBestTime,
    prevModeRef,
    pauseStartRef,
    pauseDurationRef,
    showIntro,
    skipIntro,
    npcData,
    npcLevel,
    npcStats,
    xpReward,
    prepareBattleLoot,
    grantLootBag,
    giveSummonRewards,
    summons,
    setSummons,
    summonNpc,
    clearSummons,
    updateNpcPosition,
    summonsBleedUntilRef,
    allies,
    setAllies,
    summonAlly,
    clearAllies,
    coffins,
    beginCoffinSequence,
    clearCoffins,
    coffinStartedRef,
    onSummonWrapperRef,
    charProgress,
    missingXp,
    getReplayDataRef,
  } = useBattleStageSetup({
    npcType,
    npcLevelProp,
    isAlfa,
  });

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

  const { weapon: lucasWeapon, switchWeapon } = useLucasWeaponSwitch({
    character: player.character,
    hitstopRef: refs.hitstopRef,
  });

  const battleMana = useBattleMana();
  const battleManaRef = useLatestRef(battleMana);

  const handleWeaponSwitch = useCallback(() => {
    const mana = battleManaRef.current;
    if (mana && !mana.consumeMana(LUCAS_WEAPON_SWITCH_MANA_COST)) return;
    switchWeapon();
  }, [battleManaRef, switchWeapon]);

  const { kokusenActive, kokusenFrame, triggerKokusen } = useKokusenAnimation();
  const onKokusenRef = useLatestRef(triggerKokusen);

  const { blackFlashActive, blackFlashVariant, triggerBlackFlash } =
    useBlackFlashAnimation();
  const onBlackFlashRef = useLatestRef(triggerBlackFlash);

  useEffect(() => {
    if (blackFlashActive) {
      setTimeScale(BLACK_FLASH_TIME_SCALE);
    } else {
      resetTimeScale();
    }
  }, [blackFlashActive, setTimeScale, resetTimeScale]);

  const { blinkVisual, triggerBlink, clearBlink } = useBlinkAnimation();

  const [divergentFistActive, setDivergentFistActive] = useState(false);
  const divergentFistRef = useRef(false);
  const {
    divergentFistFrame,
    triggerDivergentFist,
    clearDivergentFist,
  } = useDivergentFistAnimation();

  const onDivergentFistConsumed = useCallback(() => {
    setDivergentFistActive(false);
    forcePunchRef.current = false;
    triggerDivergentFist();
  }, [forcePunchRef, triggerDivergentFist]);
  const onDivergentFistConsumedRef = useLatestRef(onDivergentFistConsumed);

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
  const honoredOneEnabled =
    getCharacterPassive(player.character, "honoredOne") != null && !training;

  const {
    honoredOneActiveRef,
    honoredOneActive,
    honoredRegenActive,
    mostHonoredFreeze,
    mostHonoredFreezeRef,
    honoredFleeRef,
    surviveLethalHitRef,
    resetHonoredOne,
  } = useHonoredOne({
    enabled: honoredOneEnabled,
    player,
    setPlayer,
    playSound,
    refs,
    setTimeScale,
    resetTimeScale,
    battleManaRef,
    honoredRiseStartRef,
    honoredRiseStartYRef,
    honoredFallRef,
  });

  const isPaused =
    showVictory ||
    showDefeat ||
    showIntro ||
    showOutro != null ||
    showHighlight ||
    rewindFrames != null ||
    isConfigOpen ||
    isBattleNavOpen ||
    mostHonoredFreeze;
  const isPausedRef = useLatestRef(isPaused);
  const lootActiveRef = useRef(false);
  const controlsDisabled = isPaused || isPhaseTransitioning || isThrown;

  const vastolordActiveRef = useRef(false);
  const vastolordUsedRef = useRef(false);
  const vastolordMultiplierRef = useRef<() => number>(() => 1);
  const vastolordEndingRef = useRef<{ current: boolean }>({ current: false });
  const runDefeatRef = useRef<() => void>(() => {});

  const vastolordDurationMs =
    getCharacterPassive(player.character, "vastolordForm")?.effect.durationMs ??
    VASTOLORD_DURATION_MS;

  const cursedEnergyParams =
    getCharacterPassive(player.character, "cursedEnergy") != null;

  const {
    vastolordActive,
    vastolordRemainingMs,
    triggerVastolord,
    resetVastolord,
  } = useVastolordForm({
    enabled: player.character === "marcelo" && !training,
    durationMs: vastolordDurationMs,
    isPausedRef,
    isEndingRef: vastolordEndingRef,
    onExpire: () => runDefeatRef.current(),
  });
  vastolordActiveRef.current = vastolordActive;
  vastolordMultiplierRef.current = () =>
    vastolordActive ? VASTOLORD_MULTIPLIER : 1;

  targeting.npcAiHpRef.current = npcStats.hp;
  targeting.npcAiMaxHpRef.current = npcStats.hp;

  const npcRootedUntilRef = useRef(0);
  const rootedSummonsUntilRef = useRef<Record<string, number>>({});

  const npc = useNpcAI({
    playerX: player.x,
    playerY: player.y,
    playerState: player.state,
    playerDirection: player.battleDirection,
    playerCharacter: player.character,
    npcClass: npcData.class,
    npcType,
    npcPhaseRef,
    onProjectileHit: () => refs.npcRangedAttackRef.current(),
    onMeleeHit: () => refs.npcMeleeAttackRef.current(),
    isPaused: isPaused || isPhaseTransitioning || lootActiveRef.current,
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
    honoredFleeRef,
    npcHpRef: targeting.npcAiHpRef,
    npcMaxHpRef: targeting.npcAiMaxHpRef,
    npcBlockedRef: targeting.npcBlockedRef,
    onGrabPlayer,
    onThrowStart,
    onThrowPlayer,
  });

  const onCriticalPushRef = useLatestRef(() => {
    const dir = player.battleDirection === "right" ? 1 : -1;

    npc.updateNpc({
      x: Math.max(
        BATTLE_LIMITS.minX,
        Math.min(
          BATTLE_LIMITS.maxX,
          npc.x + dir * BLOCK_ATTACK_PUSH_DISTANCE,
        ),
      ),
    });

    setSummons((prev) =>
      prev
        .filter((s) => !s.isDying)
        .map((s) => ({
          ...s,
          x: Math.max(
            BATTLE_LIMITS.minX,
            Math.min(
              BATTLE_LIMITS.maxX,
              s.x + dir * BLOCK_ATTACK_PUSH_DISTANCE,
            ),
          ),
        })),
    );
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

  /**
   * Passiva Forma Vastolord do marcelo: em vez de perder a batalha, revive com
   * 100% de HP e entra na forma por 10s (uma vez por batalha).
   */
  const tryVastolordRevivalRef = useLatestRef(() => {
    if (!getCharacterPassive(player.character, "vastolordForm")) return false;
    if (vastolordUsedRef.current || vastolordActiveRef.current) return false;

    vastolordUsedRef.current = true;
    battle.isEnding.current = false;
    battle.setPlayerHP(battle.playerMaxHp);
    setPlayer((p) => ({ ...p, state: "idle" }));
    triggerVastolord();
    return true;
  });

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
      playSound("returningTime");
      battle.isEnding.current = true;
      return;
    }

    if (tryVastolordRevivalRef.current()) {
      return;
    }

    const isHardMode = difficulty === "hard" || difficulty === "insano";
    const allOthersDefeated = CHARACTERS.filter(
      (c) => c !== player.character,
    ).every((c) => progress[c]?.battleHP === 0);

    if (isHardMode && allOthersDefeated) {
      for (const c of CHARACTERS) {
        setBattleHP(c, 1);
        setBattleMana(c, null);
      }
      setMode("explore");
      void navigate(-1);
      return;
    }

    runDefeatRef.current();
  });

  const onNpcDeathRef = useLatestRef(() => {
    if (training) {
      battle.setNpcHP(battle.npcMaxHp);
      return;
    }
    setBattleHP(player.character, battle.playerHP);
    const mana = battleManaRef.current;
    if (mana) {
      setBattleMana(
        player.character,
        mana.playerMana >= mana.playerMaxMana ? null : mana.playerMana,
      );
    }
    reduceHunger(player.character, 5);
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
    spawnVictoryTombstone(npcType);
    killCounter.handleNpcDeath(
      killCounter.npcTypeRef.current,
      killCounter.npcDataRef.current.class,
      isAlfa,
    );

    const lootContents = prepareBattleLoot();
    battleLootContentsRef.current = lootContents;
    lootActiveRef.current = true;
    startBattleLoot(lootContents, npc.x, npc.y);
  });

  const {
    onBlockRef,
    onDamageTakenRef,
    onDodgeRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
  } = useStatCallbacks({
    playerCharacter: player.character,
    incrementBlockCounter,
    incrementDamageTaken,
    incrementDodgeCounter,
    incrementDamageDealt,
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
    onBlackFlashRef,
    onCriticalPushRef,
    arturOraMultiplierRef,
    vastolordMultiplierRef,
    vastolordActive,
    divergentFistRef,
    onDivergentFistConsumedRef,
    petId,
    onPetSkillRef: executePetSkillRef,
    isMenuRef: isMenuOpenRef,
    isPausedRef,
    savedPlayerHP: savedPlayerHPRef.current,
    npcStatMultiplier: isAlfa ? 2 : 1,
    npcArmorBonus,
    weapon: lucasWeapon,
    surviveLethalHitRef,
  });

  vastolordEndingRef.current = battle.isEnding;

  const {
    handleCursedEnergyConversion,
    handleBlink,
    handleActivateDivergentFist,
  } = useActiveSkills({
    cursedEnergyEnabled: cursedEnergyParams,
    battle,
    battleManaRef,
    player,
    honoredOneActiveRef,
    setPlayer,
    playSound,
    triggerBlink,
    divergentFistActive,
    divergentFistRef,
    forcePunchRef,
    setDivergentFistActive,
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

  const battleLootContentsRef = useRef<LootBagContents[]>([]);
  const {
    notifications: lootNotifications,
    spawnLootNotification,
    clearNotifications: clearLootNotifications,
  } = useLootNotifications();
  const {
    bags: lootBags,
    isActive: lootActive,
    start: startBattleLoot,
  } = useBattleLoot({
    playerX: player.x,
    playerY: player.y,
    pet: battle.pet,
    setPet: battle.setPet,
    isPausedRef,
    onCollect: grantLootBag,
    onNotify: spawnLootNotification,
    onDone: () => {
      lootActiveRef.current = false;
      setLastRewards(aggregateRewards(battleLootContentsRef.current, xpReward));
      triggerVictory();
    },
    playSound,
  });

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

    if (cursedEnergyParams) {
      battleManaRef.current?.restoreMana(cursedEnergyFromDamage(damage));
    }

    const enchantment = weaponEnchantmentRef.current;
    if (!rollEnchantmentProc(enchantment) || !enchantment) return;

    const until = Date.now() + ENCHANTMENT_DURATION_MS[enchantment];
    npcEnchantUntilRef.current[enchantment] = until;

    if (enchantment === "freeze") {
      refs.npcStaggerRef.current = Math.max(refs.npcStaggerRef.current, until);
    }

    refs.spawnDamageRef.current?.(0, npc.x, npc.y, enchantment);
  };
  refs.spawnDamageRef.current = battle.spawnDamageNumber;

  const {
    playerSnapshotRef,
    npcSnapshotRef,
    battleSnapshotRef,
    petSnapshotRef,
    comboSnapshotRef,
    comboActionRef,
    damageNumbersSnapshotRef,
    summonsSnapshotRef,
    npcProjectilesSnapshotRef,
  } = useBattleSnapshots({
    player,
    npc,
    battle,
    comboCount,
    comboRank,
    comboProgress: comboProgressValue,
    nextRank,
    summons,
    controlsDisabled,
  });

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
      weapon: lucasWeapon,
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
    isPaused: isPaused || lootActiveRef.current,
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
    honoredFleeRef,
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

  const {
    oraPress,
    oraRelease,
    extraPunches,
    extraPunchSprite,
    killerQueen,
    bombTargets,
    killerQueenSprite,
    bombSprite,
    explosionSprite,
  } = useArturBattle({
    player,
    setPlayer,
    npc,
    summons,
    onPunchHit: handleExtraPunch,
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
    arturOraMultiplierRef,
    refs,
    freezeSummonsUntilRef,
    freezeActionsUntilRef,
  });

  const npcMaxHpRef = useLatestRef(battle.npcMaxHp);
  const setNpcHPRef = useLatestRef(battle.setNpcHP);
  const isEndingRef = useLatestRef(battle.isEnding);

  useStatusDots({
    honoredRegenActive,
    battleManaRef,
    isEndingRef,
    isPausedRef,
    mostHonoredFreezeRef,
    summonsBleedUntilRef,
    setSummons,
    summons,
    setNpcHP: battle.setNpcHP,
    npcX: npc.x,
    npcY: npc.y,
    spawnDamageRef: refs.spawnDamageRef,
    npcEnchantUntilRef,
  });

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
    weapon: lucasWeapon,
    vastolordMultiplierRef,
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

  useTrainingEffects({
    training,
    npcMaxHp: battle.npcMaxHp,
    setNpcHP: battle.setNpcHP,
    isPausedRef,
  });

  const { handleRetry, defeatElapsed } = useDefeatFlow({
    player,
    setBattleHP,
    setBattleMana,
    handleDefeat,
    clearPendingTombstoneSpawn,
    setShowDefeat,
    addBattleTime,
    battleStartRef,
    prevModeRef,
    pauseStartRef,
    pauseDurationRef,
    runDefeatRef,
    resetRewind,
    charge,
    startRecording,
    resetVastolord,
    vastolordUsedRef,
    resetHonoredOne,
    resetTimeScale,
    clearBlink,
    clearDivergentFist,
    divergentFistRef,
    setDivergentFistActive,
    forcePunchRef,
    clearSummons,
    clearAllies,
    clearCoffins,
    coffinStartedRef,
    npcRootedUntilRef,
    rootedSummonsUntilRef,
    summonsBleedUntilRef,
    npcEnchantUntilRef,
    isAlfa,
    summonNpc,
    npcType,
    battle,
    npc,
    resetBattleState,
    resetCombo,
    grabbedTimerRef,
    setIsGrabbed,
  });

  return buildBattleSceneApi({
    player,
    npc,
    battle,
    npcStats,
    npcLevel,
    npcClass: npcData.class,
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
    lucasWeapon,
    switchWeapon: handleWeaponSwitch,
    convertCursedEnergy: handleCursedEnergyConversion,
    blink: handleBlink,
    blinkVisual,
    divergentFistActive,
    activateDivergentFist: handleActivateDivergentFist,
    divergentFistFrame,
    honoredOneActive,
    kokusenActive,
    kokusenFrame,
    blackFlashActive,
    blackFlashVariant,
    vastolordActive,
    vastolordRemainingMs,
    specialIntroActive,
    specialIntroCharacter,
    lootBags,
    lootActive,
    lootNotifications,
    clearLootNotifications,
  });
}

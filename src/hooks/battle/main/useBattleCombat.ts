import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useGrabThrow } from "@/hooks/battle/throw/useGrabThrow";
import { useThrowAnimation } from "@/hooks/battle/throw/useThrowAnimation";
import { useSpecialIntro } from "@/hooks/battle/modals/useSpecialIntro";
import { useNpcAI } from "@/hooks/battle/npc/useAi";
import { useBattleSystem } from "@/hooks/battle/main/useSystem";
import { useNpcTargeting } from "@/hooks/battle/npc/useNpcTargeting";
import { usePlayerBattleActions } from "@/hooks/battle/player/usePlayerActions";
import { useSummonAI } from "@/hooks/battle/summon/useAi";
import { useAllyAI } from "@/hooks/battle/summon/useAllyAI";
import { useBattleControls } from "@/hooks/battle/useControls";
import { useComboSystem } from "@/hooks/battle/effects/useComboSystem";
import { useBattleRefs } from "@/hooks/battle/utilities/useRefs";
import { useBattleKillCounter } from "@/hooks/battle/death/useKillCounter";
import { useChargeAttack } from "@/hooks/battle/charge/useAttack";
import { usePhaseTransition } from "@/hooks/battle/death/usePhaseTransition";
import { usePlayerSpecialProjectile } from "@/hooks/battle/player/usePlayerSpecialProjectile";
import { useLucasWeaponSwitch } from "@/hooks/battle/player/characters/yvel/useLucasWeaponSwitch";
import { useBattleSync } from "@/hooks/battle/useSync";
import { useBattleNavbar } from "@/contexts/BattleNavbarContext";
import { useStatCallbacks } from "@/hooks/battle/effects/useStatCallbacks";
import { useActiveSkills } from "@/hooks/battle/utilities/useActiveSkills";
import { useStatusDots } from "@/hooks/battle/effects/useStatusDots";
import { useTrainingEffects } from "@/hooks/battle/effects/useTrainingEffects";
import { useArturBattle } from "@/hooks/battle/player/characters/srGuaxinim/useArturBattle";
import {
  getWeaponEnchantment,
  rollEnchantmentProc,
} from "@/gameRules/battle/equipment";
import {
  ENCHANTMENT_DURATION_MS,
  type Enchantment,
} from "@/data/equipment/enchantments";
import { getSpecialFlowOverride } from "@/data/battle/animationFlow";
import { CHARGE_ATTACK_MIN_LEVEL } from "@/data/battle/charge";
import { LUCAS_WEAPON_SWITCH_MANA_COST } from "@/gameRules/battle/mana";
import { cursedEnergyFromDamage } from "@/gameRules/battle/cursedEnergy";
import { PET_ROOT_DURATION_MS } from "@/data/characters/petSkills";
import { runPetSkill } from "@/gameRules/battle/petSkill/petSkill";
import { applyPlayerStatus } from "@/gameRules/battle/status/statusEffects";
import {
  BATTLE_LIMITS,
  BLOCK_ATTACK_PUSH_DISTANCE,
} from "@/gameRules/movement/constants";
import { useBattleStageSetup } from "@/hooks/battle/useBattleStageSetup";
import type { NewPlayerStatus } from "@/gameRules/battle/status/statusEffects";
import type { BattleObstacle } from "@/utils/types/maps/battle";
import type { BattleManaApi } from "@/contexts/BattleManaContext";
import type { useBlinkAnimation } from "@/hooks/battle/player/characters/natsuki/useBlinkAnimation";

type Props = {
  setup: ReturnType<typeof useBattleStageSetup>;
  refs: ReturnType<typeof useBattleRefs>;
  npcType: string;
  isAlfa: boolean;
  training: boolean;
  obstacles?: BattleObstacle[];
  PLAYER_SIZE: number;
  lootActiveRef: RefObject<boolean>;
  onPlayerDeathRef: RefObject<() => void>;
  onNpcDeathRef: RefObject<() => void>;
  battleManaRef: RefObject<BattleManaApi | null>;
  isPausedRef: RefObject<boolean>;
  isMenuOpenRef: RefObject<boolean>;
  honoredOneActiveRef: RefObject<boolean>;
  honoredFleeRef: RefObject<boolean>;
  surviveLethalHitRef: RefObject<() => boolean>;
  honoredRegenActive: boolean;
  mostHonoredFreezeRef: RefObject<boolean>;
  vastolordMultiplierRef: RefObject<() => number>;
  vastolordActive: boolean;
  cursedEnergyEnabled: boolean;
  onKokusenRef: RefObject<() => void>;
  onBlackFlashRef: RefObject<() => void>;
  onDivergentFistConsumedRef: RefObject<() => void>;
  triggerBlink: ReturnType<typeof useBlinkAnimation>["triggerBlink"];
  divergentFistActive: boolean;
  divergentFistRef: RefObject<boolean>;
  setDivergentFistActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useBattleCombat({
  setup,
  refs,
  npcType,
  isAlfa,
  training,
  obstacles,
  PLAYER_SIZE,
  lootActiveRef,
  onPlayerDeathRef,
  onNpcDeathRef,
  battleManaRef,
  isPausedRef,
  isMenuOpenRef,
  honoredOneActiveRef,
  honoredFleeRef,
  surviveLethalHitRef,
  honoredRegenActive,
  mostHonoredFreezeRef,
  vastolordMultiplierRef,
  vastolordActive,
  cursedEnergyEnabled,
  onKokusenRef,
  onBlackFlashRef,
  onDivergentFistConsumedRef,
  triggerBlink,
  divergentFistActive,
  divergentFistRef,
  setDivergentFistActive,
}: Props) {
  const {
    player,
    setPlayer,
    setMode,
    attack,
    special,
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
    progress,
    playerLevel,
    getEquippedInfo,
    playSound,
    npcData,
    npcLevel,
    npcStats,
    npcPhaseRef,
    setNpcPhase,
    npcArmorBonus,
    setNpcArmorBonus,
    isPhaseTransitioning,
    setIsPhaseTransitioning,
    savedPlayerHPRef,
    summons,
    setSummons,
    clearSummons,
    updateNpcPosition,
    summonsBleedUntilRef,
    allies,
    setAllies,
    summonAlly,
    clearAllies,
    beginCoffinSequence,
    onSummonWrapperRef,
    petId,
    petSkillDef,
    petLevel,
    petStars,
    closeInventory,
    closeNavbar,
    giveSummonRewards,
    incrementBlockCounter,
    incrementDamageTaken,
    incrementDodgeCounter,
    incrementDamageDealt,
    inventoryItems,
    quests,
  } = setup;

  const { weapon: lucasWeapon, switchWeapon } = useLucasWeaponSwitch({
    character: player.character,
    hitstopRef: refs.hitstopRef,
  });

  const handleWeaponSwitch = useCallback(() => {
    const mana = battleManaRef.current;
    if (mana && !mana.consumeMana(LUCAS_WEAPON_SWITCH_MANA_COST)) return;
    switchWeapon();
  }, [battleManaRef, switchWeapon]);

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

  const npcRootedUntilRef = useRef(0);
  const rootedSummonsUntilRef = useRef<Record<string, number>>({});

  targeting.npcAiHpRef.current = npcStats.hp;
  targeting.npcAiMaxHpRef.current = npcStats.hp;

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
    isPaused:
      isPausedRef.current || isPhaseTransitioning || lootActiveRef.current,
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
    obstacles,
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
        Math.min(BATTLE_LIMITS.maxX, npc.x + dir * BLOCK_ATTACK_PUSH_DISTANCE),
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

  const {
    handleCursedEnergyConversion,
    handleBlink,
    handleActivateDivergentFist,
  } = useActiveSkills({
    cursedEnergyEnabled,
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

    if (cursedEnergyEnabled) {
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
    isPaused: isPausedRef.current || lootActiveRef.current,
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
    isPaused: isPausedRef.current,
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

  const controlsDisabled =
    isPausedRef.current || isPhaseTransitioning || isThrown;

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

  useEffect(() => {
    battleTenacityRef.current = battle.tenacityReduction;
  }, [battle.tenacityReduction, battleTenacityRef]);

  return {
    battle,
    npc,
    charge,
    lucasWeapon,
    switchWeapon: handleWeaponSwitch,
    grabFlipped,
    grabbedTimerRef,
    setIsGrabbed,
    killCounter,
    saveDataRef,
    npcRootedUntilRef,
    rootedSummonsUntilRef,
    npcEnchantUntilRef,
    controlsDisabled,
    comboCount,
    comboRank,
    comboProgress: comboProgressValue,
    nextRank,
    resetCombo,
    handleCursedEnergyConversion,
    handleBlink,
    handleActivateDivergentFist,
    playerProjectile,
    specialIntroActive,
    specialIntroCharacter,
    extraPunches,
    extraPunchSprite,
    killerQueen,
    bombTargets,
    killerQueenSprite,
    bombSprite,
    explosionSprite,
  };
}

import { useState, useEffect, useCallback } from "react";
import { battleBehaviors } from "@/gameRules/battle/behaviors/player";
import {
  getPetSkillDefinition,
  PET_SKILL_COOLDOWN_MS,
} from "@/data/characters/petSkills";
import { useLatestRef } from "@/hooks/useLatestRef";
import { usePetSkillCooldown } from "@/hooks/battle/player/usePetSkill";
import { usePetPassive } from "@/hooks/battle/player/usePetPassive";

import { useBattleStats } from "@/hooks/battle/useStats";
import { useBattleHP } from "@/hooks/battle/death/useHP";
import { useBattleCooldowns } from "@/hooks/battle/useCooldowns";
import { useBattleEffects } from "@/hooks/battle/useEffects";
import { usePlayerBattle } from "@/hooks/battle/player/usePlayer";
import { useNpcBattle } from "@/hooks/battle/npc/useNpc";
import { useBattleLifecycle } from "@/hooks/battle/death/useLifecycle";
import { usePetBattle } from "@/hooks/battle/player/usePet";
import { useDamageNumbers } from "@/hooks/battle/damage/useNumbers";
import { useExternalDamage } from "@/hooks/battle/damage/useExternal";
import { useBlockGauge } from "@/hooks/battle/useBlockGauge";
import {
  getHalfHealReduction,
  HALFHEAL_DURATION_MS,
  getEquippedResistances,
  reduceDurationByResistance,
  reduceTickDamage,
} from "@/gameRules/battle/equipment";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { getProfessionWeaponDamageMultiplier } from "@/gameRules/professions/weapon";
import { gainSpecial } from "@/gameRules/battle/special";
import {
  applyPlayerStatus,
  clearPlayerStatuses,
  STATUS_DURATIONS_MS,
  BURN_TICK_DAMAGE,
  POISON_TICK_DAMAGE,
  DOT_TICK_INTERVAL_MS,
  type NewPlayerStatus,
} from "@/gameRules/battle/status/statusEffects";

type Props = {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  npcLevel: number;
  npcClass: "common" | "rare" | "epic" | "boss" | "legendary";
  npcType: string;
  onPlayerDeath: () => void;
  onNpcDeath: () => void;
  playerState: PlayerState;
  difficulty: NpcDifficulty;
  hitstopRef: React.RefObject<number>;
  npcStaggerRef: React.RefObject<number>;
  registerHitRef: React.RefObject<(damage: number) => void>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  lastBlockPressRef: React.RefObject<number>;
  npcPhaseRef: React.RefObject<number>;
  onBeforeNpcHitRef?: React.RefObject<() => boolean>;
  onBlockRef?: React.RefObject<() => void>;
  onDamageTakenRef?: React.RefObject<(amount: number) => void>;
  onDodgeRef?: React.RefObject<() => void>;
  onDamageDealtRef?: React.RefObject<(amount: number) => void>;
  onAttackRef?: React.RefObject<() => void>;
  onSpecialRef?: React.RefObject<() => void>;
  onKokusenRef?: React.RefObject<() => void>;
  arturOraMultiplierRef?: React.RefObject<() => number>;
  petId?: string | null;
  onPetSkillRef?: React.RefObject<() => void>;
  isMenuRef?: React.RefObject<boolean>;
  savedPlayerHP?: number | null;
  npcStatMultiplier?: number;
  npcArmorBonus?: number;
};

export function useBattleSystem(props: Props) {
  const {
    playerX,
    playerY,
    npcX,
    npcY,
    npcLevel,
    npcClass,
    npcType,
    playerState,
    difficulty,
    onPlayerDeath,
    onNpcDeath,
    hitstopRef,
    npcStaggerRef,
    registerHitRef,
    setPlayer,
    lastBlockPressRef,
    npcPhaseRef,
    onBeforeNpcHitRef,
    onBlockRef,
    onDamageTakenRef,
    onDodgeRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
    onKokusenRef,
    arturOraMultiplierRef,
    petId = null,
    onPetSkillRef,
    isMenuRef,
    savedPlayerHP,
    npcStatMultiplier = 1,
    npcArmorBonus = 0,
  } = props;

  const [npcPhase, setNpcPhase] = useState(1);

  const stats = useBattleStats({
    npcLevel,
    npcClass,
    difficulty,
    npcPhase,
    npcStatMultiplier,
    npcArmorBonus,
  });
  const {
    player,
    playerClass,
    char,
    totalArmor,
    totalShield,
    totalVampirism,
    totalReflect,
    totalMaxHpDamage,
    totalTrueDamage,
    titleBonus,
    getElementDamageBonus,
    playerMaxHp,
    npcMaxHp,
    npcArmor,
    critRate,
    HITS_TO_SPECIAL,
    hasPet,
    equippedWeaponId,
  } = stats;

  const { blockGauge, setBlockGauge, blockLimit, resetBlockGauge } =
    useBlockGauge(char.level, totalArmor);

  const behavior = (battleBehaviors[player.character] ||
    battleBehaviors.default)!;

  const npcElementTypes = getNpcElementTypes(npcType);

  const elementDamageBonus = getElementDamageBonus(npcElementTypes);

  const professionWeaponMultiplier = equippedWeaponId
    ? getProfessionWeaponDamageMultiplier(equippedWeaponId, npcElementTypes)
    : 1;

  const professionElementDamageBonus =
    elementDamageBonus * professionWeaponMultiplier;

  const halfHealReduction = getHalfHealReduction(player.character);
  const equippedResistances = getEquippedResistances(player.character);
  const burnTickDamage = reduceTickDamage(
    BURN_TICK_DAMAGE,
    equippedResistances.heat,
  );
  const onHalfHeal =
    halfHealReduction > 0
      ? () => {
          setPlayer((p) => ({
            ...p,
            halfHealUntil: Date.now() + HALFHEAL_DURATION_MS,
          }));
        }
      : undefined;

  const { playerCooldown, npcCooldown, isEnding } = useBattleCooldowns();

  const effects = useBattleEffects({ character: player.character });

  const { damageNumbers, spawnDamageNumber, clearDamageNumbers } =
    useDamageNumbers();
  const spawnDamageRef = useLatestRef(spawnDamageNumber);

  const bleedXRef = useLatestRef(playerX);
  const bleedYRef = useLatestRef(playerY);
  const bleedUntilRef = useLatestRef(player.bleedUntil);
  const burnUntilRef = useLatestRef(player.burnUntil);
  const poisonUntilRef = useLatestRef(player.poisonUntil);

  const {
    playerHP,
    setPlayerHP,
    npcHP,
    setNpcHP,
    playerShield,
    setPlayerShield,
  } = useBattleHP(playerMaxHp, npcMaxHp, totalShield, savedPlayerHP);

  const petSkillDef = petId ? getPetSkillDefinition(petId) : null;
  const petIsBattle =
    hasPet && petSkillDef !== null && petSkillDef.role !== "montaria";

  const { oneHitShieldRef, reset: resetPetPassive } = usePetPassive({
    passiveEffect: petSkillDef?.passiveEffect ?? null,
    enabled: petIsBattle,
    isPaused: isEnding.current,
  });

  const playerBattle = usePlayerBattle({
    player,
    playerClass,
    char,
    behavior,
    playerX,
    playerY,
    npcX,
    npcY,
    playerState,
    npcClass,
    npcElementTypes,
    HITS_TO_SPECIAL,
    setNpcHP,
    setPlayerHP,
    playerHP,
    playerMaxHp,
    totalVampirism,
    totalMaxHpDamage,
    totalTrueDamage,
    playerCooldown,
    isEnding,
    spawnPiercing: effects.spawnPiercing,
    triggerExplosion: effects.triggerExplosion,
    titleDamageBonus: titleBonus.damage,
    elementDamageBonus: professionElementDamageBonus,
    critRate: stats.critRate,
    npcArmor,
    spawnDamageRef,
    hitstopRef,
    registerHitRef,
    setPlayer,
    onBeforeNpcHitRef,
    onDamageDealtRef,
    onAttackRef,
    onSpecialRef,
    onKokusenRef,
    onHalfHeal,
    arturOraMultiplierRef,
  });

  const { damagePlayerHp, damagePlayer } = useExternalDamage({
    playerX,
    playerY,
    player,
    totalArmor,
    blockGauge,
    playerShield,
    setPlayerHP,
    setPlayerShield,
    setBlockGauge,
    setPlayer,
    spawnDamageRef,
    onBlockRef,
    oneHitShieldRef,
    lastBlockPressRef,
    onParry: () => {
      playerBattle.setDelicia((d) => gainSpecial(d, HITS_TO_SPECIAL));
    },
  });

  const { pet, resetPet, triggerJumpAttack } = usePetBattle({
    enabled: petIsBattle,
    playerX,
    playerY,
    npcX,
    isPaused: isEnding.current,
    spriteNpcType: petSkillDef?.battleSprite ?? "goat",
  });

  const {
    remaining: petSkillRemaining,
    ready: petSkillReady,
    trigger: triggerPetSkill,
    reset: resetPetSkill,
  } = usePetSkillCooldown({
    enabled: petIsBattle,
    cooldownMs: petSkillDef?.skill.cooldownMs ?? PET_SKILL_COOLDOWN_MS,
    isPaused: isEnding.current,
    onTrigger: () => onPetSkillRef?.current?.(),
  });

  const npcBattle = useNpcBattle({
    npcLevel,
    npcClass,
    playerClass,
    playerX,
    playerY,
    npcX,
    npcY,
    player,
    totalArmor,
    damagePlayerHp,
    setPlayer,
    setNpcHP,
    totalReflect,
    npcCooldown,
    difficulty,
    isEnding,
    spawnDamageRef,
    hitstopRef,
    npcStaggerRef,
    blockGauge,
    setBlockGauge,
    lastBlockPressRef,
    onBlockRef,
    titleEnemyMissChance: titleBonus.enemyMissChance,
    onDamageTakenRef,
    onDodgeRef,
    onHalfHeal,
    onParry: () => {
      playerBattle.setDelicia((d) => gainSpecial(d, HITS_TO_SPECIAL));
    },
    npcType,
    npcHp: npcHP,
    npcMaxHp,
    npcPhase,
    tenacityReduction: stats.tenacityReduction,
    luckBonus: stats.luckBonus,
    statMultiplier: npcStatMultiplier,
  });

  const { isNpcDying } = useBattleLifecycle({
    playerHP,
    npcHP,
    npcClass,
    setNpcPhase,
    npcPhaseRef,
    setNpcHP,
    npcMaxHp,
    onPlayerDeath,
    onNpcDeath,
    isEnding,
  });

  useStatusDotTicks({
    isEnding,
    isMenuRef,
    setPlayerHP,
    spawnDamageRef,
    burnTickDamage,
    bleedXRef,
    bleedYRef,
    bleedUntilRef,
    burnUntilRef,
    poisonUntilRef,
  });

  usePlayerPullAnimation(setPlayer, isMenuRef);

  const resetBattle = () => {
    setPlayerHP(playerMaxHp);
    setPlayerShield(totalShield);
    resetBlockGauge();
    setNpcHP(npcMaxHp);
    setNpcPhase(1);
    playerBattle.setDelicia(0);
    playerBattle.setStacks(0);
    effects.resetEffects();
    clearDamageNumbers();
    playerCooldown.current = true;
    npcCooldown.current = true;
    isEnding.current = false;
    behavior.reset?.({
      setStacks: playerBattle.setStacks,
      setDelicia: playerBattle.setDelicia,
    });
    resetPet();
    resetPetSkill();
    resetPetPassive();
    setPlayer((p) => ({
      ...clearPlayerStatuses(p),
      halfHealUntil: 0,
      pullFromX: 0,
      pullToX: 0,
      pullStartTime: 0,
      grabbedUntil: 0,
    }));
  };

  const applyStatus = useCallback(
    (status: NewPlayerStatus, durationMs?: number) => {
      setPlayer((p) => {
        const base = durationMs ?? STATUS_DURATIONS_MS[status];
        const resistance =
          status === "burn"
            ? equippedResistances.heat
            : status === "freeze"
              ? equippedResistances.cold
              : status === "blind"
                ? equippedResistances.blind
                : 0;
        const reduced = reduceDurationByResistance(base, resistance);
        if (reduced <= 0) return p;
        return applyPlayerStatus(p, status, reduced);
      });
    },
    [
      setPlayer,
      equippedResistances.heat,
      equippedResistances.cold,
      equippedResistances.blind,
    ],
  );

  return {
    playerHP,
    setPlayerHP,
    playerMaxHp,
    playerShield,
    setPlayerShield,
    npcHP,
    setNpcHP,
    npcMaxHp,
    npcPhase,
    delicia: playerBattle.delicia,
    setDelicia: playerBattle.setDelicia,
    hitsToSpecial: HITS_TO_SPECIAL,
    playerHit: playerBattle.playerHit,
    specialHit: playerBattle.specialHit,
    npcMeleeHit: npcBattle.npcMeleeHit,
    npcRangedHit: npcBattle.npcRangedHit,
    npcThrowHit: npcBattle.npcThrowHit,
    npcFixedHit: npcBattle.npcFixedHit,
    resetBattle,
    damagePlayer,
    damagePlayerHp,
    isNpcDying,
    playerCooldown,
    isEnding,
    piercings: effects.piercings,
    isExploding: effects.isExploding,
    pet,
    triggerJumpAttack,
    petSkill: petSkillDef
      ? {
          definition: petSkillDef,
          remaining: petSkillRemaining,
          ready: petSkillReady,
          trigger: triggerPetSkill,
        }
      : null,
    damageNumbers,
    spawnDamageNumber,
    char,
    critRate,
    npcArmor,
    totalVampirism,
    totalReflect,
    titleDamageBonus: titleBonus.damage,
    elementDamageBonus: professionElementDamageBonus,
    blockGauge,
    blockLimit,
    tenacityReduction: stats.tenacityReduction,
    halfHealReduction,
    applyStatus,
  };
}

function useStatusDotTicks(params: {
  isEnding: React.RefObject<boolean>;
  isMenuRef?: React.RefObject<boolean>;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  burnTickDamage: number;
  bleedXRef: React.RefObject<number>;
  bleedYRef: React.RefObject<number>;
  bleedUntilRef: React.RefObject<number>;
  burnUntilRef: React.RefObject<number>;
  poisonUntilRef: React.RefObject<number>;
}) {
  const {
    isEnding,
    isMenuRef,
    setPlayerHP,
    spawnDamageRef,
    burnTickDamage,
    bleedXRef,
    bleedYRef,
    bleedUntilRef,
    burnUntilRef,
    poisonUntilRef,
  } = params;

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnding.current || isMenuRef?.current) return;
      if (bleedUntilRef.current > Date.now()) {
        setPlayerHP((hp) => Math.max(0, hp - 2));
        spawnDamageRef.current?.(
          2,
          bleedXRef.current,
          bleedYRef.current,
          "bleed",
        );
      }
      if (burnUntilRef.current > Date.now()) {
        setPlayerHP((hp) => Math.max(0, hp - burnTickDamage));
        spawnDamageRef.current?.(
          burnTickDamage,
          bleedXRef.current,
          bleedYRef.current,
          "burn",
        );
      }
      if (poisonUntilRef.current > Date.now()) {
        setPlayerHP((hp) => Math.max(0, hp - POISON_TICK_DAMAGE));
        spawnDamageRef.current?.(
          POISON_TICK_DAMAGE,
          bleedXRef.current,
          bleedYRef.current,
          "poison",
        );
      }
    }, DOT_TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [
    setPlayerHP,
    isEnding,
    isMenuRef,
    burnTickDamage,
    bleedXRef,
    bleedYRef,
    bleedUntilRef,
    burnUntilRef,
    poisonUntilRef,
    spawnDamageRef,
  ]);
}

function usePlayerPullAnimation(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  isMenuRef?: React.RefObject<boolean>,
) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMenuRef?.current) return;
      setPlayer((p) => {
        if (p.pullStartTime === 0) return p;
        const elapsed = Date.now() - p.pullStartTime;
        const duration = 300;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentX = p.pullFromX + (p.pullToX - p.pullFromX) * eased;
        if (progress >= 1) {
          return { ...p, x: p.pullToX, pullStartTime: 0 };
        }
        return { ...p, x: currentX };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [setPlayer, isMenuRef]);
}

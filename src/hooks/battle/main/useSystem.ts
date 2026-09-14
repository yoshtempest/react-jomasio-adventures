import { useState, useCallback, useRef } from "react";
import { battleBehaviors } from "@/gameRules/battle/behaviors/player";
import {
  getPetSkillDefinition,
  PET_SKILL_COOLDOWN_MS,
} from "@/data/characters/petSkills";
import { useLatestRef } from "@/hooks/useLatestRef";
import { usePetSkillCooldown } from "@/hooks/battle/player/pets/usePetSkill";
import { usePetPassive } from "@/hooks/battle/player/pets/usePetPassive";

import { useBattleStats } from "@/hooks/battle/useStats";
import { VASTOLORD_MULTIPLIER } from "@/hooks/battle/player/characters/marshadow/useVastolordForm";
import { useBattleHP } from "@/hooks/battle/death/useHP";
import { useBattleCooldowns } from "@/hooks/battle/utilities/useCooldowns";
import { useBattleEffects } from "@/hooks/battle/effects/useEffects";
import { usePlayerBattle } from "@/hooks/battle/player/usePlayer";
import { useNpcBattle } from "@/hooks/battle/npc/useNpc";
import { useBattleLifecycle } from "@/hooks/battle/death/useLifecycle";
import { usePetBattle } from "@/hooks/battle/player/pets/usePet";
import { useDamageNumbers } from "@/hooks/battle/damage/useNumbers";
import { useExternalDamage } from "@/hooks/battle/damage/useExternal";
import { useBlockGauge } from "@/hooks/battle/effects/useBlockGauge";
import {
  getHalfHealReduction,
  HALFHEAL_DURATION_MS,
  getEquippedResistances,
  reduceDurationByResistance,
  reduceTickDamage,
} from "@/gameRules/battle/equipment";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { getProfessionWeaponDamageMultiplier } from "@/gameRules/professions/weapon";
import { useEnergy } from "@/hooks/battle/effects/useEnergy";
import { useBattleMana } from "@/contexts/BattleManaContext";
import { gainSpecial } from "@/gameRules/battle/special";
import {
  applyPlayerStatus,
  clearPlayerStatuses,
  STATUS_DURATIONS_MS,
  BURN_TICK_DAMAGE,
  type NewPlayerStatus,
} from "@/gameRules/battle/status/statusEffects";
import { useStatusDotTicks } from "@/hooks/battle/time/ticks/useStatusDotsTicks";
import { useNpcBleedTicks } from "@/hooks/battle/time/ticks/useNpcBleedTicks";
import { useManaRegenTick } from "@/hooks/battle/time/ticks/useManaRegenTick";
import { usePlayerPullAnimation } from "@/hooks/battle/player/usePlayerPullAnimation";

type Props = {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  npcLevel: number;
  npcClass:
    "common" | "rare" | "epic" | "boss" | "legendary" | "supreme" | "omega";
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
  lastAttackPressRef?: React.RefObject<number>;
  npcPhaseRef: React.RefObject<number>;
  onBeforeNpcHitRef?: React.RefObject<() => boolean>;
  onBlockRef?: React.RefObject<() => void>;
  onDamageTakenRef?: React.RefObject<(amount: number) => void>;
  onDodgeRef?: React.RefObject<() => void>;
  onDamageDealtRef?: React.RefObject<(amount: number) => void>;
  onAttackRef?: React.RefObject<() => void>;
  onSpecialRef?: React.RefObject<() => void>;
  onKokusenRef?: React.RefObject<() => void>;
  onBlackFlashRef?: React.RefObject<() => void>;
  onCriticalPushRef?: React.RefObject<() => void>;
  arturOraMultiplierRef?: React.RefObject<() => number>;
  /** Aplica o multiplicador da Forma Vastolord no dano do marcelo. */
  vastolordMultiplierRef?: React.RefObject<() => number>;
  /** Forma Vastolord ativa: multiplica a armadura do marcelo por 4. */
  vastolordActive?: boolean;
  /** Punho Divergente: true quando ativado, consome no próximo golpe básico. */
  divergentFistRef?: React.RefObject<boolean>;
  onDivergentFistConsumedRef?: React.RefObject<() => void>;
  petId?: string | null;
  onPetSkillRef?: React.RefObject<() => void>;
  isMenuRef?: React.RefObject<boolean>;
  /** Pausa global (menu/intro/victory/passiva O Abençoado): pausa os ticks de dano. */
  isPausedRef?: React.RefObject<boolean>;
  savedPlayerHP?: number | null;
  npcStatMultiplier?: number;
  npcArmorBonus?: number;
  weapon?: LucasWeapon;
  /** Passiva O Abençoado: quando retorna true, o golpe letal reduz a vida a 1. */
  surviveLethalHitRef?: React.RefObject<() => boolean>;
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
    lastAttackPressRef,
    npcPhaseRef,
    onBeforeNpcHitRef,
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
    vastolordActive = false,
    petId = null,
    divergentFistRef,
    onDivergentFistConsumedRef,
    onPetSkillRef,
    isMenuRef,
    isPausedRef,
    savedPlayerHP,
    npcStatMultiplier = 1,
    npcArmorBonus = 0,
    weapon,
    surviveLethalHitRef,
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

  const npcBleedUntilRef = useRef(0);
  const npcBleedXRef = useLatestRef(npcX);
  const npcBleedYRef = useLatestRef(npcY);

  const {
    playerHP,
    setPlayerHP,
    npcHP,
    setNpcHP,
    playerShield,
    setPlayerShield,
  } = useBattleHP(playerMaxHp, npcMaxHp, totalShield, savedPlayerHP);

  const energy = useEnergy(player, playerMaxHp, setPlayerShield);

  const battleMana = useBattleMana();
  const battleManaRef = useLatestRef(battleMana);

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
    onBlackFlashRef,
    onCriticalPushRef,
    onHalfHeal,
    arturOraMultiplierRef,
    vastolordMultiplierRef,
    divergentFistRef,
    onDivergentFistConsumedRef,
    weapon,
  });

  const { damagePlayerHp, damagePlayer } = useExternalDamage({
    playerX,
    playerY,
    player,
    totalArmor: vastolordActive
      ? totalArmor * VASTOLORD_MULTIPLIER
      : totalArmor,
    blockGauge,
    playerShield,
    playerHP,
    setPlayerHP,
    setPlayerShield,
    setBlockGauge,
    setPlayer,
    spawnDamageRef,
    onBlockRef,
    oneHitShieldRef,
    lastBlockPressRef,
    lastAttackPressRef,
    onParry: () => {
      playerBattle.setDelicia((d) => gainSpecial(d, HITS_TO_SPECIAL));
    },
    onDamageTaken: energy.consumeOnDamage,
    surviveLethalHitRef,
  });

  const { pet, setPet, resetPet, triggerJumpAttack, triggerTeleportBite } =
    usePetBattle({
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
    playerLevel: char.level,
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
    lastAttackPressRef,
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
    isPausedRef,
    setPlayerHP,
    spawnDamageRef,
    burnTickDamage,
    bleedXRef,
    bleedYRef,
    bleedUntilRef,
    burnUntilRef,
    poisonUntilRef,
  });

  useNpcBleedTicks({
    isEnding,
    isMenuRef,
    isPausedRef,
    setNpcHP,
    spawnDamageRef,
    npcBleedXRef,
    npcBleedYRef,
    npcBleedUntilRef,
  });

  usePlayerPullAnimation(setPlayer, isMenuRef);

  useManaRegenTick(
    battleManaRef,
    isEnding,
    isMenuRef,
    player.character !== "riquelme",
    isPausedRef,
  );

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
    npcBleedUntilRef.current = 0;
    energy.resetEnergy();
    battleMana?.resetMana();
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

  const applyNpcBleed = useCallback((durationMs: number) => {
    npcBleedUntilRef.current = Math.max(
      npcBleedUntilRef.current,
      Date.now() + durationMs,
    );
  }, []);

  return {
    playerHP,
    setPlayerHP,
    playerMaxHp,
    playerShield,
    setPlayerShield,
    energy: energy.enabled ? energy.energy : undefined,
    mana: battleMana?.playerMana,
    manaMax: battleMana?.playerMaxMana,
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
    npcUnblockableHit: npcBattle.npcUnblockableHit,
    resetBattle,
    damagePlayer,
    damagePlayerHp,
    isNpcDying,
    playerCooldown,
    isEnding,
    piercings: effects.piercings,
    isExploding: effects.isExploding,
    pet,
    setPet,
    triggerJumpAttack,
    triggerTeleportBite,
    applyNpcBleed,
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

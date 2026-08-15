import {
  calculatePlayerDamage,
  calculateDamageToNpc,
  getBerserkMultiplier,
  calculateSpecialDamage,
  calculateMaxHpBonus,
} from "@/gameRules/battle/damage";
import { rollCrit } from "@/gameRules/battle/damageUtils";
import { getElementMultiplier } from "@/gameRules/battle/element";
import { playAttackSound } from "@/utils/types/battle/playAttackSound";
import type { BattleBehavior } from "@/utils/types/player/behavior";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import type { ElementType } from "@/utils/types/battle/element";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";

type BaseHitParams = {
  player: Player;
  playerClass: PlayerClass;
  char: CharacterProgress;
  behavior: BattleBehavior;
  titleDamageBonus: number;
  critRate: number;
  npcArmor: number;
  npcElementTypes: readonly ElementType[];
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
  totalMaxHpDamage: number;
  totalTrueDamage: number;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  spawnDamageRef: React.RefObject<
    (value: number, x: number, y: number, type: DamageType) => void
  >;
  registerHitRef: React.RefObject<(damage: number) => void>;
  hitstopRef: React.RefObject<number>;
  onDamageDealtRef?: React.RefObject<(amount: number) => void>;
  onAttackRef?: React.RefObject<() => void>;
  onSpecialRef?: React.RefObject<() => void>;
};

type DamageCalcParams = {
  player: Player;
  playerClass: PlayerClass;
  char: CharacterProgress;
  titleDamageBonus: number;
  critRate: number;
  npcArmor: number;
  npcElementTypes: readonly ElementType[];
  playerHP: number;
  playerMaxHp: number;
  totalMaxHpDamage: number;
  totalTrueDamage: number;
  damageMultiplier: number;
};

export function calculateBasicHitDamage({
  player,
  playerClass,
  char,
  titleDamageBonus,
  critRate,
  npcArmor,
  npcElementTypes,
  playerHP,
  playerMaxHp,
  totalMaxHpDamage,
  totalTrueDamage,
  damageMultiplier,
}: DamageCalcParams): { damage: number; isCrit: boolean; type: DamageType } {
  const isLarissa = player.character === "larissa";
  const rawDmg = isLarissa
    ? 2
    : calculatePlayerDamage(char.stats.strength, playerClass, titleDamageBonus);
  const maxHpBonus = calculateMaxHpBonus(playerMaxHp, totalMaxHpDamage);
  const dmgWithHpBonus = rawDmg + maxHpBonus;
  const berserkDmg =
    player.character === "samuel" && char.level >= 20
      ? Math.round(dmgWithHpBonus * getBerserkMultiplier(playerHP, playerMaxHp))
      : dmgWithHpBonus;
  const { damage: critDmg, type: dmgType } = rollCrit(berserkDmg, critRate);
  const armorReduced = calculateDamageToNpc(critDmg, npcArmor);
  const elementMultiplier = getElementMultiplier(
    CHARACTER_ELEMENT_TYPES[player.character],
    npcElementTypes,
  );
  const trueDmg =
    Math.round(armorReduced * damageMultiplier * elementMultiplier) +
    totalTrueDamage;

  return { damage: trueDmg, isCrit: dmgType === "crit", type: dmgType };
}

export function calculateSpecialHitDamage({
  player,
  playerClass,
  char,
  critRate,
  npcArmor,
  npcElementTypes,
  playerHP,
  playerMaxHp,
  totalMaxHpDamage,
  totalTrueDamage,
  damageMultiplier,
  stacks,
}: Omit<DamageCalcParams, "titleDamageBonus"> & {
  stacks: number;
}): { damage: number; isCrit: boolean; type: DamageType } {
  const isLarissa = player.character === "larissa";
  const rawDmg = isLarissa
    ? stacks * 5
    : calculateSpecialDamage(char.stats.intelligence, playerClass);
  const maxHpBonus = calculateMaxHpBonus(playerMaxHp, totalMaxHpDamage);
  const dmgWithHpBonus = rawDmg + maxHpBonus;
  const berserkDmg =
    player.character === "samuel" && char.level >= 20
      ? Math.round(dmgWithHpBonus * getBerserkMultiplier(playerHP, playerMaxHp))
      : dmgWithHpBonus;
  const { damage: critDmg, type: dmgType } = rollCrit(berserkDmg, critRate);
  const armorReduced = calculateDamageToNpc(critDmg, npcArmor);
  const elementMultiplier = getElementMultiplier(
    CHARACTER_ELEMENT_TYPES[player.character],
    npcElementTypes,
  );
  const trueDmg =
    Math.round(armorReduced * damageMultiplier * elementMultiplier) +
    totalTrueDamage;

  return { damage: trueDmg, isCrit: dmgType === "crit", type: dmgType };
}

type BasicHitParams = BaseHitParams & {
  damageMultiplier: number;
  npcX: number;
  npcY: number;
  spawnPiercing: () => void;
  setDelicia: React.Dispatch<React.SetStateAction<number>>;
  setStacks: React.Dispatch<React.SetStateAction<number>>;
  HITS_TO_SPECIAL: number;
};

export function applyBasicHit({
  player,
  playerClass,
  char,
  behavior,
  titleDamageBonus,
  critRate,
  npcArmor,
  npcElementTypes,
  playerHP,
  playerMaxHp,
  totalVampirism,
  totalMaxHpDamage,
  totalTrueDamage,
  setNpcHP,
  setPlayerHP,
  setPlayer,
  spawnDamageRef,
  registerHitRef,
  hitstopRef,
  onDamageDealtRef,
  onAttackRef,
  damageMultiplier,
  npcX,
  npcY,
  spawnPiercing,
  setDelicia,
  setStacks,
  HITS_TO_SPECIAL,
}: BasicHitParams) {
  playAttackSound(player.character);
  navigator.vibrate?.(20);

  const { damage: trueDmg, isCrit, type: dmgType } = calculateBasicHitDamage({
    player,
    playerClass,
    char,
    titleDamageBonus,
    critRate,
    npcArmor,
    npcElementTypes,
    playerHP,
    playerMaxHp,
    totalMaxHpDamage,
    totalTrueDamage,
    damageMultiplier,
  });
  if (isCrit) setPlayer((p) => ({ ...p, state: "crit" }));

  behavior.onBasicHit({
    damage: trueDmg,
    setNpcHP,
    char,
    playerClass,
    setDelicia,
    HITS_TO_SPECIAL,
    setStacks,
    spawnPiercing,
    titleDamageBonus,
  });

  spawnDamageRef.current?.(trueDmg, npcX, npcY, dmgType);
  registerHitRef.current?.(trueDmg);
  onDamageDealtRef?.current?.(trueDmg);
  onAttackRef?.current?.();
  hitstopRef.current = Date.now() + 60;

  if (totalVampirism > 0) {
    const heal = Math.round((trueDmg * totalVampirism) / 100);
    if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
  }

  return trueDmg;
}

type SpecialHitParams = BaseHitParams & {
  damageMultiplier: number;
  npcX: number;
  npcY: number;
  stacks: number;
  setStacks: React.Dispatch<React.SetStateAction<number>>;
  triggerExplosion: () => void;
  setDelicia: React.Dispatch<React.SetStateAction<number>>;
  hitsToSpecial: number;
};

export function applySpecialHit({
  player,
  playerClass,
  char,
  behavior,
  critRate,
  npcArmor,
  npcElementTypes,
  playerHP,
  playerMaxHp,
  totalVampirism,
  totalMaxHpDamage,
  totalTrueDamage,
  setNpcHP,
  setPlayerHP,
  setPlayer,
  spawnDamageRef,
  registerHitRef,
  hitstopRef,
  onDamageDealtRef,
  onSpecialRef,
  damageMultiplier,
  npcX,
  npcY,
  stacks,
  setStacks,
  triggerExplosion,
  setDelicia,
  hitsToSpecial,
}: SpecialHitParams) {
  navigator.vibrate?.(30);

  const { damage: trueDmg, isCrit, type: dmgType } =
    calculateSpecialHitDamage({
      player,
      playerClass,
      char,
      critRate,
      npcArmor,
      npcElementTypes,
      playerHP,
      playerMaxHp,
      totalMaxHpDamage,
      totalTrueDamage,
      damageMultiplier,
      stacks,
    });
  if (isCrit) setPlayer((p) => ({ ...p, state: "crit" }));

  behavior.onSpecialHit({
    damage: trueDmg,
    setNpcHP,
    char,
    playerClass,
    setDelicia,
    hitsToSpecial,
    stacks,
    setStacks,
    triggerExplosion,
  });

  spawnDamageRef.current?.(trueDmg, npcX, npcY, dmgType);
  registerHitRef.current?.(trueDmg);
  onDamageDealtRef?.current?.(trueDmg);
  onSpecialRef?.current?.();
  hitstopRef.current = Date.now() + 100;

  if (totalVampirism > 0) {
    const heal = Math.round((trueDmg * totalVampirism) / 100);
    if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
  }

  return trueDmg;
}

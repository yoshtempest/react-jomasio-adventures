import {
  calculatePlayerDamage,
  calculateDamageToNpc,
  getBerserkMultiplier,
  calculateSpecialDamage,
} from "@/gameRules/battle/damage";
import { rollCrit } from "@/gameRules/battle/damageUtils";
import { playAttackSound } from "@/utils/types/battle/playAttackSound";
import type { BattleBehavior } from "@/utils/types/player/behavior";
import type { CharacterProgress } from "@/data/characters/defaultProgress";

type BaseHitParams = {
  player: Player;
  playerClass: PlayerClass;
  char: CharacterProgress;
  behavior: BattleBehavior;
  titleDamageBonus: number;
  critRate: number;
  npcArmor: number;
  playerHP: number;
  playerMaxHp: number;
  totalVampirism: number;
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
  playerHP,
  playerMaxHp,
  totalVampirism,
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

  const isLarissa = player.character === "larissa";
  const rawDmg = isLarissa
    ? 2
    : calculatePlayerDamage(char.stats.strength, playerClass, titleDamageBonus);
  const berserkDmg =
    player.character === "samuel" && char.level >= 20
      ? Math.round(rawDmg * getBerserkMultiplier(playerHP, playerMaxHp))
      : rawDmg;
  const { damage: critDmg, type: dmgType } = rollCrit(berserkDmg, critRate);
  if (dmgType === "crit") setPlayer((p) => ({ ...p, state: "crit" }));
  const dmg = Math.round(
    calculateDamageToNpc(critDmg, npcArmor) * damageMultiplier,
  );

  behavior.onBasicHit({
    damage: dmg,
    setNpcHP,
    char,
    playerClass,
    setDelicia,
    HITS_TO_SPECIAL,
    setStacks,
    spawnPiercing,
    titleDamageBonus,
  });

  spawnDamageRef.current?.(dmg, npcX, npcY, dmgType);
  registerHitRef.current?.(dmg);
  onDamageDealtRef?.current?.(dmg);
  onAttackRef?.current?.();
  hitstopRef.current = Date.now() + 60;

  if (totalVampirism > 0) {
    const heal = Math.round((dmg * totalVampirism) / 100);
    if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
  }

  return dmg;
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
  playerHP,
  playerMaxHp,
  totalVampirism,
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

  const isLarissa = player.character === "larissa";
  const rawDmg = isLarissa
    ? stacks * 5
    : calculateSpecialDamage(char.stats.intelligence, playerClass);
  const berserkDmg =
    player.character === "samuel" && char.level >= 20
      ? Math.round(rawDmg * getBerserkMultiplier(playerHP, playerMaxHp))
      : rawDmg;
  const { damage: critDmg, type: dmgType } = rollCrit(berserkDmg, critRate);
  if (dmgType === "crit") setPlayer((p) => ({ ...p, state: "crit" }));
  const dmg = Math.round(
    calculateDamageToNpc(critDmg, npcArmor) * damageMultiplier,
  );

  behavior.onSpecialHit({
    damage: dmg,
    setNpcHP,
    char,
    playerClass,
    setDelicia,
    hitsToSpecial,
    stacks,
    setStacks,
    triggerExplosion,
  });

  spawnDamageRef.current?.(dmg, npcX, npcY, dmgType);
  registerHitRef.current?.(dmg);
  onDamageDealtRef?.current?.(dmg);
  onSpecialRef?.current?.();
  hitstopRef.current = Date.now() + 100;

  if (totalVampirism > 0) {
    const heal = Math.round((dmg * totalVampirism) / 100);
    if (heal > 0) setPlayerHP((hp) => Math.min(playerMaxHp, hp + heal));
  }

  return dmg;
}

import { playAttackSound } from "@/utils/audio/playAttackSound";
import type { BattleBehavior } from "@/utils/types/player/behavior";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import type { ElementType } from "@/utils/types/battle/element";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { combatService } from "@/services/combat";

type BaseHitParams = {
  player: Player;
  playerClass: PlayerClass;
  char: CharacterProgress;
  behavior: BattleBehavior;
  titleDamageBonus: number;
  elementDamageBonus: number;
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
  elementDamageBonus: number;
  critRate: number;
  npcArmor: number;
  npcElementTypes: readonly ElementType[];
  playerHP: number;
  playerMaxHp: number;
  totalMaxHpDamage: number;
  totalTrueDamage: number;
  damageMultiplier: number;
};

type ComputeHitDamageParams = Omit<
  DamageCalcParams,
  "titleDamageBonus" | "playerClass"
> & {
  rawDmg: number;
};

function computeHitDamage({
  player,
  char,
  critRate,
  npcArmor,
  npcElementTypes,
  playerHP,
  playerMaxHp,
  totalMaxHpDamage,
  totalTrueDamage,
  damageMultiplier,
  elementDamageBonus,
  rawDmg,
}: ComputeHitDamageParams): {
  damage: number;
  isCrit: boolean;
  type: DamageType;
} {
  const maxHpBonus = combatService.calculateMaxHpBonus(playerMaxHp, totalMaxHpDamage);
  const dmgWithHpBonus = rawDmg + maxHpBonus;
  const berserkDmg =
    player.character === "samuel" && char.level >= 20
      ? Math.round(dmgWithHpBonus * combatService.getBerserkMultiplier(playerHP, playerMaxHp))
      : dmgWithHpBonus;
  const { damage: critDmg, type: dmgType } = combatService.rollCrit(berserkDmg, critRate);
  const armorReduced = combatService.calculateDamageToNpc(critDmg, npcArmor);
  const elementMultiplier = combatService.getElementMultiplier(
    CHARACTER_ELEMENT_TYPES[player.character],
    npcElementTypes,
  );
  const trueDmg =
    Math.round(
      armorReduced * damageMultiplier * elementMultiplier * elementDamageBonus,
    ) + totalTrueDamage;

  return { damage: trueDmg, isCrit: dmgType === "crit", type: dmgType };
}

export function calculateBasicHitDamage(params: DamageCalcParams): {
  damage: number;
  isCrit: boolean;
  type: DamageType;
} {
  const rawDmg =
    params.player.character === "larissa"
      ? 2
      : combatService.calculatePlayerDamage(
          params.char.stats.strength,
          params.playerClass,
          params.titleDamageBonus,
        );

  return computeHitDamage({ ...params, rawDmg });
}

export function calculateSpecialHitDamage(
  params: Omit<DamageCalcParams, "titleDamageBonus"> & { stacks: number },
): { damage: number; isCrit: boolean; type: DamageType } {
  const rawDmg =
    params.player.character === "larissa"
      ? params.stacks * 5
      : combatService.calculateSpecialDamage(
          params.char.stats.intelligence,
          params.playerClass,
        );

  return computeHitDamage({ ...params, rawDmg });
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

function finishHit(
  params: BaseHitParams & { npcX: number; npcY: number },
  damage: number,
  dmgType: DamageType,
  hitstop: number,
  onActionRef?: React.RefObject<() => void>,
) {
  params.spawnDamageRef.current?.(damage, params.npcX, params.npcY, dmgType);
  params.registerHitRef.current?.(damage);
  params.onDamageDealtRef?.current?.(damage);
  onActionRef?.current?.();
  params.hitstopRef.current = Date.now() + hitstop;

  if (params.totalVampirism > 0) {
    const heal = Math.round((damage * params.totalVampirism) / 100);
    if (heal > 0)
      params.setPlayerHP((hp) => Math.min(params.playerMaxHp, hp + heal));
  }
}

export function applyBasicHit(params: BasicHitParams) {
  playAttackSound(params.player.character);
  navigator.vibrate?.(20);

  const {
    damage: trueDmg,
    isCrit,
    type: dmgType,
  } = calculateBasicHitDamage(params);

  if (isCrit) params.setPlayer((p) => ({ ...p, state: "crit" }));

  params.behavior.onBasicHit({
    damage: trueDmg,
    setNpcHP: params.setNpcHP,
    char: params.char,
    playerClass: params.playerClass,
    setDelicia: params.setDelicia,
    HITS_TO_SPECIAL: params.HITS_TO_SPECIAL,
    setStacks: params.setStacks,
    spawnPiercing: params.spawnPiercing,
    titleDamageBonus: params.titleDamageBonus,
  });

  finishHit(params, trueDmg, dmgType, 60, params.onAttackRef);

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

export function applySpecialHit(params: SpecialHitParams) {
  navigator.vibrate?.(30);

  const {
    damage: trueDmg,
    isCrit,
    type: dmgType,
  } = calculateSpecialHitDamage(params);

  if (isCrit) params.setPlayer((p) => ({ ...p, state: "crit" }));

  params.behavior.onSpecialHit({
    damage: trueDmg,
    stacks: params.stacks,
    setNpcHP: params.setNpcHP,
    setStacks: params.setStacks,
    setDelicia: params.setDelicia,
    hitsToSpecial: params.hitsToSpecial,
    char: params.char,
    playerClass: params.playerClass,
    triggerExplosion: params.triggerExplosion,
  });

  finishHit(params, trueDmg, dmgType, 100, params.onSpecialRef);

  return trueDmg;
}

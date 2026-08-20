import { getNpcStats } from "@/gameRules/npc/npcStats";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { getElementMultiplier } from "@/gameRules/battle/element";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";

type Params = {
  npcLevel: number;
  npcClass: NPCClass;
  playerClass: PlayerClass;
  totalArmor: number;
  difficulty: NpcDifficulty;
  npcType: string;
  playerCharacter: CharacterId;
  npcPhase: number;
  npcHp: number;
  npcMaxHp: number;
};

export function evaluateNpcHit({
  npcLevel,
  npcClass,
  playerClass,
  totalArmor,
  difficulty,
  npcType,
  playerCharacter,
  npcPhase,
  npcHp,
  npcMaxHp,
}: Params): { finalDmg: number; dmgType: DamageType } {
  const npc = getNpcStats(npcLevel, npcClass, difficulty);
  const baseDmg = npc.damage;
  const dmg = calculateNpcDamage(baseDmg, playerClass, totalArmor);

  const hpRatio = npcMaxHp > 0 ? npcHp / npcMaxHp : 1;
  const clampedRatio = Math.max(0, Math.min(1, hpRatio));
  let critChance = 1;
  if (npcType === "slimita" && npcPhase >= 2) {
    critChance = 1 + (1 - clampedRatio) * 9;
  }
  const isCrit = Math.random() * 100 < critChance;
  const elementMultiplier = getElementMultiplier(
    getNpcElementTypes(npcType),
    CHARACTER_ELEMENT_TYPES[playerCharacter],
  );
  const finalDmg = Math.round((isCrit ? dmg * 2 : dmg) * elementMultiplier);
  const dmgType: DamageType = isCrit ? "crit" : "npc";

  return { finalDmg, dmgType };
}

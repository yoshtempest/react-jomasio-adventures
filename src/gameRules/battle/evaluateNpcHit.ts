import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { calculateNpcDamage } from "@/gameRules/battle/damage";

type Params = {
  npcLevel: number;
  npcClass: NPCClass;
  playerClass: PlayerClass;
  totalArmor: number;
  difficulty: NpcDifficulty;
  npcType: string;
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
  const finalDmg = isCrit ? dmg * 2 : dmg;
  const dmgType: DamageType = isCrit ? "crit" : "npc";

  return { finalDmg, dmgType };
}

import { getNpcVsPlayerMultiplier } from "@/gameRules/battle/npcVsPlayerDamage";

/**
 * Funil do dano de NPC contra o player.
 *
 * Passa por aqui todo golpe corpo a corpo do NPC (os dois caminhos de melee em
 * `useNpc`).
 */
export function rollNpcDamage(
  dmg: number,
  hpRatio: number,
  npcType: string,
  npcPhase: number,
  playerCharacter: CharacterId,
): { finalDmg: number; dmgType: DamageType } {
  const clampedRatio = Math.max(0, Math.min(1, hpRatio));
  let critChance = 1;
  if (npcType === "slimita" && npcPhase >= 2) {
    critChance = 1 + (1 - clampedRatio) * 9;
  }
  const isCrit = Math.random() * 100 < critChance;
  const finalDmg = Math.round(
    (isCrit ? dmg * 2 : dmg) *
      getNpcVsPlayerMultiplier(npcType, playerCharacter),
  );
  const dmgType: DamageType = isCrit ? "crit" : "npc";
  return { finalDmg, dmgType };
}

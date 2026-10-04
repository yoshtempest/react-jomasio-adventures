import { getNpcVsPlayerMultiplier } from "@/gameRules/battle/npcVsPlayerDamage";
import { combatService } from "@/services/combat";
import {
  DAMAGE_KINDS,
  type DamageArmor,
  type DamageKind,
} from "@/utils/types/battle/damageKind";

type ProjectProjectileDamageParams = {
  npcDamage: number;
  playerClass: PlayerClass;
  totalArmor: DamageArmor;
  npcType: string;
  playerCharacter: CharacterId;
  /** Mesma natureza do projétil que vai acertar; define a coluna de armadura. */
  damageType?: DamageKind;
};

/**
 * Dano determinístico que um projétil causaria caso acertasse o jogador,
 * espelhando o pipeline de `npcRangedHit` (base do NPC + redução de armadura
 * + multiplicador elemental) sem a aleatoriedade de crítico.
 *
 * Usado só para escalar a vida dos projéteis destrutíveis, então erro aqui
 * aparece como "o projétil morre com um golpe a mais ou a menos", nunca como
 * dano errado ao jogador.
 */
export function projectProjectileDamage({
  npcDamage,
  playerClass,
  totalArmor,
  npcType,
  playerCharacter,
  damageType,
}: ProjectProjectileDamageParams): number {
  const dmg = combatService.calculateNpcDamage(
    npcDamage,
    damageType ?? "physical",
    playerClass,
    totalArmor,
  );
  return Math.round(dmg * getNpcVsPlayerMultiplier(npcType, playerCharacter));
}

/** Vida de um projétil destrutível: 1/3 do dano que causaria no jogador. */
export function getProjectileDestructionHp(projectedDamage: number): number {
  return Math.max(1, Math.round(projectedDamage / 3));
}

/**
 * As três vidas de projétil de uma mesma criatura. Um projétil mágico que
 * enfrenta uma armadura mágica alta custa menos golpes para derrubar do que
 * um físico, então a escala precisa ser por natureza — não há "a" vida do
 * projétil de um NPC que atira dos dois jeitos.
 */
export function getProjectileDestructionHpByKind(
  params: ProjectProjectileDamageParams,
): Record<DamageKind, number> {
  const hp = {} as Record<DamageKind, number>;
  for (const kind of DAMAGE_KINDS) {
    hp[kind] = getProjectileDestructionHp(
      projectProjectileDamage({ ...params, damageType: kind }),
    );
  }
  return hp;
}

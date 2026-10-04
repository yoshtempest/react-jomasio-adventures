import type { DamageArmor, DamageKind } from "@/utils/types/battle/damageKind";

/** Armadura zerada — para summons sem defesa e para alvos sem armadura. */
export const NO_ARMOR: DamageArmor = { physical: 0, magical: 0 };

/**
 * Coluna de armadura que a natureza do dado consegue furar.
 *
 * `true` não tem coluna: retorna 0, e é isso que faz o dano verdadeiro ignorar
 * qualquer armadura. Concentrar a decisão num único ponto é o que impede um
 * funil de "achar" a coluna errada.
 */
export function getArmorFor(kind: DamageKind, armor: DamageArmor): number {
  switch (kind) {
    case "magical":
      return armor.magical;
    case "physical":
      return armor.physical;
    case "true":
      return 0;
  }
}

/** Soma colunas de armadura preservando as duas. */
export function addArmor(base: DamageArmor, extra: DamageArmor): DamageArmor {
  return {
    physical: base.physical + extra.physical,
    magical: base.magical + extra.magical,
  };
}

/** Escala as duas colunas (Forma Vastolord multiplica a armadura por 4). */
export function scaleArmor(
  armor: DamageArmor,
  multiplier: number,
): DamageArmor {
  return {
    physical: armor.physical * multiplier,
    magical: armor.magical * multiplier,
  };
}

/**
 * Projeção de armadura para um único número, para os sistemas que não têm como
 * lidar com a separação: o medidor de block é carregado por golpe bruto de
 * qualquer natureza. Usa a coluna mais alta das duas, que na esmagadora maioria
 * dos casos é a física — o dado dá a mesma base para ambas.
 */
export function getBlockArmor(armor: DamageArmor): number {
  return Math.max(armor.physical, armor.magical);
}

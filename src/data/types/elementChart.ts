import type { ElementType } from "@/utils/types/battle/element";

export const ELEMENT_STRONG_AGAINST: Record<
  ElementType,
  readonly ElementType[]
> = {
  Pyrus: ["Metallum", "Natura"],
  Aquos: ["Pyrus", "Subterra"],
  Subterra: ["Pyrus", "Electricus", "Metallum"],
  Ventus: ["Subterra", "Natura"],
  Darkus: ["Haos", "Nympha", "Umbra", "Psychicus"],
  Electricus: ["Aquos", "Ventus", "Natura"],
  Haos: ["Darkus", "Umbra"],
  Metallum: ["Ventus", "Haos", "Electricus"],
  Natura: ["Aquos", "Subterra"],
  Psychicus: ["Umbra", "Normalis"],
  Nympha: ["Darkus", "Haos", "Draco"],
  Draco: ["Draco", "Normalis"],
  Umbra: ["Darkus", "Haos", "Psychicus", "Nympha"],
  Normalis: [],
};

/**
 * Inverte a tabela de vantagem: `A` forte contra `D` significa `D` fraco
 * contra `A`.
 *
 * Args:
 *     strong (Record<ElementType, readonly ElementType[]>): tabela de
 *         vantagem, atacante para defensores.
 *
 * Returns:
 *     A tabela de desvantagem correspondente, com entrada para todo
 *     elemento (lista vazia quando ninguém tem vantagem sobre ele).
 */
function buildWeakAgainst(
  strong: Record<ElementType, readonly ElementType[]>,
): Record<ElementType, readonly ElementType[]> {
  const weak = {} as Record<ElementType, ElementType[]>;

  for (const element of Object.keys(strong) as ElementType[]) {
    weak[element] = [];
  }

  for (const element of Object.keys(strong) as ElementType[]) {
    for (const defender of strong[element]) {
      weak[defender].push(element);
    }
  }

  return weak;
}

/**
 * Desvantagem elemental, derivada de `ELEMENT_STRONG_AGAINST`.
 *
 * As duas tabelas eram escritas à mão e divergiam: em sete elementos a
 * lista de desvantagem não batia com o inverso da lista de vantagem, e
 * em seis pares o mesmo defensor aparecia nas duas listas do mesmo
 * atacante sem que nada no dado dissesse qual valia.
 *
 * Derivar acaba com a divergência arbitrária, não com todo par que cai
 * nos dois lados. Vantagem mútua continua existindo — Darkus e Haos são
 * fortes um contra o outro por design, e `getElementMultiplier` testa
 * vantagem antes de desvantagem, então esses pares resolvem 1.5x nas
 * duas direções. A diferença é que agora isso é consequência declarada
 * do `ELEMENT_STRONG_AGAINST`, e não de duas tabelas que se
 * desencontraram.
 */
export const ELEMENT_WEAK_AGAINST: Record<ElementType, readonly ElementType[]> =
  buildWeakAgainst(ELEMENT_STRONG_AGAINST);

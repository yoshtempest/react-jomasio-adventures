/**
 * Redução de cooldown (CDR) das habilidades ativas do personagem.
 *
 * A regra é uma hipérbole, a mesma curva de `getTenacityReduction`: o valor
 * bruto (soma das fontes em pontos percentuais) passa por
 * `raw * K / (K + raw)`. Isso dá retorno decrescente — cada ponto adicional rende
 * menos que o anterior — e nunca deixa a redução passar de `MAX`.
 *
 * O teto de 90% é uma regra de design, não limitação técnica: nenhuma build
 * pode zerar o cooldown de uma habilidade e quebrar o ritmo da batalha.
 */
const COOLDOWN_REDUCTION_K = 100;

/** Teto da redução efetiva, em pontos percentuais. */
export const MAX_COOLDOWN_REDUCTION = 90;

/** Redução bruta que um ponto de Técnica concede, em pontos percentuais. */
export const TECHNIQUE_CDR_PER_POINT = 1;

/**
 * Converte a redução bruta somada na redução efetiva, como fração (0 a 0.9).
 *
 * `rawPercent` é a soma simples das fontes — 10% de um item mais 10% de outro
 * são 20 pontos percentuais. A curva age sobre esse total, não sobre cada fonte
 * isolada.
 *
 * Referência da curva (K=100): 20 → 16,7 · 50 → 33,3 · 100 → 50 · 200 → 66,7 ·
 * 900 → 90 (teto).
 */
export function getCooldownReduction(rawPercent: number): number {
  if (rawPercent <= 0) return 0;
  const effective =
    (rawPercent * COOLDOWN_REDUCTION_K) / (COOLDOWN_REDUCTION_K + rawPercent);
  return Math.min(effective, MAX_COOLDOWN_REDUCTION) / 100;
}

/**
 * Soma bruta de CDR: pontos de Técnica mais equipamento e título.
 *
 * Técnica entra pela curva, então um ponto a mais rende cada vez menos — e o
 * teto efetivo de 90% é aplicado em `getCooldownReduction`, nunca aqui.
 */
export function getRawCooldownReduction(
  technique: number,
  equipmentRaw: number,
  titleRaw: number,
): number {
  return technique * TECHNIQUE_CDR_PER_POINT + equipmentRaw + titleRaw;
}

/**
 * Aplica a redução sobre um cooldown em ms.
 *
 * `rawPercent` é a redução BRUTA (mesma unidade de `getRawCooldownReduction`) —
 * a curva é aplicada aqui dentro, e não no call site, para que nenhum caminho
 * de cooldown esqueça de converter e leia 90 pontos percentuais como 90%.
 *
 * O piso de 1ms protege contra uma divisão futura que devolva exatamente 1 e
 * zere o timer.
 */
export function applyCooldownReduction(
  baseMs: number,
  rawPercent: number,
): number {
  if (baseMs <= 0) return 0;
  return Math.max(
    1,
    Math.round(baseMs * (1 - getCooldownReduction(rawPercent))),
  );
}

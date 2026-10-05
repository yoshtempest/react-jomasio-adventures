/**
 * Piso de dano: nenhum golpe que conecta pode resultar em 0.
 *
 * O problema que isto resolve: todo funil de dano terminava em `Math.round`, e
 * `Math.round(0.4) === 0`. Contra um alvo com armadura alta o dano
 * pós-mitigação caía abaixo de 0.5, arredondava para 0, e o golpe era
 * descartado — não adiado, **descartado**. Pior no Laser do Vastolord, que
 * subtraía do acumulador o valor pré-armadura mesmo quando o dano entregue
 * era 0: três segundos de feixe davam 0.
 *
 * A regra do jogo é "dano mínimo 0.01". Só que o piso não pode ser aplicado
 * DEPOIS do arredondamento, senão um golpe que devia tirar 0.4 tiraria 0.01
 * (40× nerf) e o alvo ficaria imortal. A correção são dois passos:
 *
 * 1. A fração atravessa o funil (nada de `Math.round` no meio do caminho), para
 *    que as instâncias de um golpe repetido acumulem o dano que de fato cabe.
 * 2. No fim do funil, `atLeastMinDamage` garante que o que sai é no mínimo
 *    0.01 — para o caso do dano ser tão pequeno que nem a fração salva.
 *
 * Ou seja: o piso é uma garantia de "nunca 0", não um substituto da conta.
 */

/** Menor dano que um golpe conectado pode entregar. */
export const MIN_HIT_DAMAGE = 0.01;

/**
 * Garante o piso de dano no fim de um funil.
 *
 * Só entra aqui dano que já foi calculado como conectado. Não passar por isto
 * blocked, parry, miss ou alvo imune: esses são "não acertou", não "acertou e
 * não tirou nada".
 */
export function atLeastMinDamage(damage: number): number {
  if (!Number.isFinite(damage)) return MIN_HIT_DAMAGE;
  return damage >= MIN_HIT_DAMAGE ? damage : MIN_HIT_DAMAGE;
}

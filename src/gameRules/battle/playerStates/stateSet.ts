/**
 * Fonte única de verdade sobre os estados do jogador (`PlayerState`).
 *
 * Os grupos semânticos (e a divisão `PlayerCanActState | PlayerCantActState`)
 * vivem em `utils/types/global.d.ts`. Aqui ficam os `Set`s e os predicados
 * derivados desses grupos, para que nenhum outro arquivo precise repetir a
 * lista de literais.
 *
 * Para incluir um estado novo: acrescente no grupo de tipo em `global.d.ts` e
 * no `Set` correspondente aqui. `animationFlow` é `Record<PlayerState, …>`
 * exaustivo, então um estado sem entrada quebra a compilação.
 */

export type StatePredicate = (state: PlayerState) => boolean;

/**
 * Cria um `Set` de estados a partir de literais. O tipo genérico amarra o set
 * ao grupo semântico: um literal fora do grupo (ou renomeado) não compila.
 */
export function stateSet<Group extends PlayerState>(
  ...members: readonly Group[]
): ReadonlySet<PlayerState> {
  return new Set<PlayerState>(members);
}

/**
 * Estado usado para escolher o sprite: `charging` não tem sprite próprio
 * (reaproveita o `idle`) e o agachado mantém o seu.
 */
export function resolveSpriteState(state: PlayerState): PlayerState {
  return state === "charging" ? "idle" : state;
}

import type { StatePredicate } from "./stateSet";

/** Cria o predicado de membership de um grupo. */
export function isOf(group: ReadonlySet<PlayerState>): StatePredicate {
  return (state) => group.has(state);
}

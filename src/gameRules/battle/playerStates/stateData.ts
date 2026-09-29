/**
 * Lê um mapa de dados (sprite, pasta, som) por estado. Aceita mapas tipados
 * por um grupo mais narrow — estados fora do grupo retornam `null` em vez de
 * forçar um cast no ponto de uso.
 */
export function stateData<T, Group extends PlayerState>(
  map: Readonly<Partial<Record<Group, T>>> | undefined,
  state: PlayerState,
): T | null {
  if (map == null) return null;
  return (map as Readonly<Partial<Record<PlayerState, T>>>)[state] ?? null;
}

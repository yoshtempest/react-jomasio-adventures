/** Une vários grupos em um set derivado (sem repetir literais). */
export function unionOf(
  ...groups: ReadonlySet<PlayerState>[]
): ReadonlySet<PlayerState> {
  const members = new Set<PlayerState>();
  for (const group of groups) for (const state of group) members.add(state);
  return members;
}
export function canSelectCharacter(selectable: boolean) {
  return selectable;
}

export function getSelected<T>(list: readonly T[], index: number): T {
  return list[index]!;
}

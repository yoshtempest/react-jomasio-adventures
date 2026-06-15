export function canSelectCharacter(selectable: boolean) {
  return selectable;
}

export function getSelected<T>(list: T[], index: number) {
  return list[index];
}

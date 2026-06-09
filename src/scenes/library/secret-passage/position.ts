export function getSecretPassageInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage?.startsWith("/footballcourt")) {
    return { x: 8, y: 3, direction: "down" };
  }

  return { x: 8, y: 10, direction: "up" };
}
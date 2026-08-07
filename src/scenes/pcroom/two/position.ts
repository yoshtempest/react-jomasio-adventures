export function getPcRoomTwoInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage?.startsWith("/pcroom")) {
    return { x: 9, y: 8, direction: "down" };
  }

  return { x: 3, y: 3, direction: "down" };
}

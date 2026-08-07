export function getPcRoomSixInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage?.startsWith("/pcroom")) {
    return { x: 15, y: 3, direction: "left" };
  }

  return { x: 3, y: 3, direction: "down" };
}

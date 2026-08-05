export function getPcRoomSixInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage?.startsWith("/pcRoom")) {
    return { x: 12, y: 3, direction: "left" };
  }

  return { x: 3, y: 3, direction: "down" };
}

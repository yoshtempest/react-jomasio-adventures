export function getPcRoomTwoInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/pcroom/one") {
    return { x: 9, y: 6, direction: "down" };
  }

  if (lastPage === "/pcroom/battle/one") {
    return { x: 16, y: 3, direction: "right" };
  }

  return { x: 3, y: 3, direction: "down" };
}

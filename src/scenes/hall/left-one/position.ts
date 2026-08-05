export function getHallLeftOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/hall/center-one") {
    return { x: 9, y: 1, direction: "down" };
  }

  return { x: 9, y: 11, direction: "up" };
}

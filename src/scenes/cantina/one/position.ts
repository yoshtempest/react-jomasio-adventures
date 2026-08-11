export function getCantinaOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/director/two") {
    return { x: 12, y: 3, direction: "down" };
  }
  if (lastPage === "/cantina/battle") {
    return { x: 11, y: 4, direction: "up" };
  }

  return { x: 10, y: 13, direction: "up" };
}

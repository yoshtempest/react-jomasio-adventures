export function getCantinaOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/director/two") {
    return { x: 10, y: 4, direction: "down" };
  }
  if (lastPage === "/cantina/battle") {
    return { x: 9, y: 5, direction: "up" };
  }

  return { x: 8, y: 11, direction: "up" };
}

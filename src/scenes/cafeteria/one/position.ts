export function getCafeteriaOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/cafeteria/battle") {
    return { x: 17, y: 5, direction: "right" };
  }

  return { x: 8, y: 11, direction: "up" };
}

export function getCenterOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/hall/center-front") {
    return { x: 9, y: 2, direction: "down" };
  }

  if (lastPage?.startsWith("/cantina")) {
    return { x: 4, y: 6, direction: "right" };
  }

  if (lastPage === "/hall/hell") {
    return { x: 15, y: 6, direction: "left" };
  }

  return { x: 9, y: 11, direction: "up" };
}

export function getHallOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage?.startsWith("/pcroom")) {
    return { x: 13, y: 7, direction: "left" };
  }
  if (lastPage === "/hall/left-one") {
    return { x: 3, y: 8, direction: "right" };
  }
  if (lastPage?.startsWith("/hall/jailson")) {
    return { x: 9, y: 1, direction: "down" };
  }
  if (lastPage?.startsWith("/cantina")) {
    return { x: 9, y: 11, direction: "up" };
  }

  return { x: 2, y: 9, direction: "down" };
}

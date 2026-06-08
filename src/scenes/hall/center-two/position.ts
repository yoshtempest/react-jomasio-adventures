export function getCenterTwoInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage === "/hall/center-front") {
    return { x: 8, y: 6, direction: "down" };
  }

  if (lastPage === "/cantina/two") {
    return { x: 4, y: 7, direction: "right" };
  }

  if (lastPage === "/hall/hell") {
    return { x: 13, y: 7, direction: "left" };
  }

  return { x: 8, y: 10, direction: "up" };
}
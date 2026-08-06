export function getCenterFrontInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/hall/thirdclass") {
    return { x: 13, y: 4, direction: "left" };
  }

  return { x: 8, y: 11, direction: "up" };
}

export function getCafeteriaFourInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage?.startsWith("/cafeteria")) {
    return { x: 13, y: 5, direction: "left" };
  }

  return { x: 8, y: 10, direction: "up" };
}

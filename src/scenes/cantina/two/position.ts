export function getCantinaTwoInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/hall/one" || lastPage === "/hall/afterpcroom-one") {
    return { x: 16, y: 12, direction: "left" };
  }

  if (lastPage === "/hall/center-one") {
    return { x: 2, y: 3, direction: "down" };
  }
  if (lastPage?.startsWith("/cafeteria")) {
    return { x: 6, y: 3, direction: "down" };
  }

  if (lastPage === "/director/two") {
    return { x: 10, y: 4, direction: "down" };
  }

  return { x: 11, y: 4, direction: "up" };
}

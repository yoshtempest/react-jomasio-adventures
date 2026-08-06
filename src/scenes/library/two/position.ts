export function getCantinaTwoInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/library/secret-passage") {
    return { x: 14, y: 3, direction: "down" };
  }

  return { x: 14, y: 3, direction: "up" };
}

export function getCantinaTwoInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/hall/library-secret-passage") {
    return { x: 14, y: 11, direction: "left" };
  }

  return { x: 9, y: 5, direction: "up" };
}

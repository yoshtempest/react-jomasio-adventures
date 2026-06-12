export function getHellInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage === "/hall/pandemony") {
    return { x: 8, y: 4, direction: "down" };
  }

  return { x: 8, y: 10, direction: "up" };
}
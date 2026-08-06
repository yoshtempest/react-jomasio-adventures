export function getHellInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage === "/hall/pandemony") {
    return { x: 8, y: 4, direction: "down" };
  }

  return { x: 9, y: 11, direction: "up" };
}

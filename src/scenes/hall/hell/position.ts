export function getHellInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage === "/hall/pandemony") {
    return { x: 10, y: 2, direction: "down" };
  }

  return { x: 9, y: 11, direction: "up" };
}

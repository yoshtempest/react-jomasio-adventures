export function getHellInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage === "/hall/pandemony") {
    return { x: 10, y: 2, direction: "down" };
  }

  if (lastPage?.startsWith("/hellroom")) {
    return { x: 14, y: 7, direction: "left" };
  }

  return { x: 9, y: 11, direction: "up" };
}

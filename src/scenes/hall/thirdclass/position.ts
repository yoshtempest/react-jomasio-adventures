export function getThirdClassInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage?.startsWith("/library")) {
    return { x: 8, y: 4, direction: "down" };
  }

  if (lastPage === "/brodiclass/one") {
    return { x: 4, y: 7, direction: "right" };
  }

  return { x: 8, y: 10, direction: "up" };
}

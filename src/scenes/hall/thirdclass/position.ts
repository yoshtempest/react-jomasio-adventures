export function getThirdClassInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage?.startsWith("/library")) {
    return { x: 10, y: 3, direction: "down" };
  }

  if (lastPage === "/brodiclass/one") {
    return { x: 4, y: 7, direction: "right" };
  }

  return { x: 9, y: 11, direction: "up" };
}

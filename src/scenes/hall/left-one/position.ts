export function getHallLeftOneInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage === "/hall/center-one") {
    return { x: 8, y: 3, direction: "down" };
  }

  return { x: 9, y: 10, direction: "up" };
}
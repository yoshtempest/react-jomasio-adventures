export function getHallLeftOneInitialPosition(lastPage?: LastPage) {
  if (lastPage === "/hall/center-one") {
    return { x: 9, y: 5, direction: "down" };
  }

  return { x: 9, y: 10, direction: "up" };
}
export function getHallOneInitialPosition(lastPage?: LastPage) {
  if (lastPage === "/hall/jailson-one") {
    return { x: 8, y: 3, direction: "down" };
  }

  if (lastPage === "/pcroom/one") {
    return { x: 12, y: 7, direction: "left" };
  }

  return { x: 9, y: 10, direction: "up" };
}
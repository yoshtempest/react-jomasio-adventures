export function getHallOneInitialPosition(lastPage?: LastPage) {
  if (lastPage?.startsWith("/hall/jailson")) {
    return { x: 8, y: 3, direction: "down" };
  }

  if (lastPage === "/pcroom/one") {
    return { x: 12, y: 7, direction: "left" };
  }

  if (lastPage === "/hall/left-one") {
    return { x: 2, y: 10, direction: "right" };
  }

  return { x: 9, y: 10, direction: "up" };
}
export function getAfterPcRoomOneInitialPosition(lastPage?: LastPage) {
  if (lastPage === "/pcroom/six") {
    return { x: 12, y: 7, direction: "left" };
  }
  if (lastPage === "/hall/left-one") {
    return { x: 2, y: 10, direction: "right" };
  }
  if (lastPage === "/hall/jailson-one" || lastPage === "/hall/jailson-two") {
    return { x: 8, y: 3, direction: "down" };
  }

  return { x: 2, y: 9, direction: "down" };
}
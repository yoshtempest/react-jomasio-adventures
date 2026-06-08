export function getAfterPcRoomOneInitialPosition(lastPage?: LastPage): ExplorePosition {
  if (lastPage === "/pcroom/six") {
    return { x: 11, y: 7, direction: "left" };
  }
  if (lastPage === "/hall/left-one") {
    return { x: 3, y: 8, direction: "right" };
  }
  if (lastPage?.startsWith("/hall/jailson")) {
    return { x: 8, y: 3, direction: "down" };
  }

  return { x: 2, y: 9, direction: "down" };
}
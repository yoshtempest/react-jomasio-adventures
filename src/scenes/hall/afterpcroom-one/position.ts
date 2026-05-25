export function getAfterPcRoomOneInitialPosition(lastPage?: string) {
  if (lastPage === "/pcroom/six") {
    return { x: 12, y: 7, direction: "left" as const };
  }
  if (lastPage === "/hall/left-one") {
    return { x: 2, y: 10, direction: "right" as const };
  }
  if (lastPage === "/hall/jailson-one" || lastPage === "/hall/jailson-two") {
    return { x: 8, y: 3, direction: "down" as const };
  }

  return { x: 2, y: 9, direction: "down" as const };
}
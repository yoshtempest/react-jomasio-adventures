export function getHallOneInitialPosition(lastPage?: string) {
  if (lastPage === "/hall/jailson-one") {
    return { x: 8, y: 3, direction: "down" as const };
  }

  if (lastPage === "/pcroom/one") {
    return { x: 12, y: 7, direction: "left" as const };
  }

  return { x: 9, y: 10, direction: "up" as const };
}
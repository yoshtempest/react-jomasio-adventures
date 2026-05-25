export function getHallLeftOneInitialPosition(lastPage?: string) {
  if (lastPage === "/hall/center-one") {
    return { x: 9, y: 5, direction: "down" as const };
  }

  return { x: 9, y: 10, direction: "up" as const };
}
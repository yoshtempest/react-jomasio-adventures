export function getCenterOneInitialPosition(lastPage?: string) {
  if (lastPage === "/hall/center-front") {
    return { x: 8, y: 6, direction: "down" as const };
  }

  if (lastPage === "/cantina/two") {
    return { x: 4, y: 7, direction: "right" as const };
  }

  if (lastPage === "/hall/hell") {
    return { x: 13, y: 7, direction: "left" as const };
  }

  return { x: 8, y: 10, direction: "up" as const };
}
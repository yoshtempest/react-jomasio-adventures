export function getCenterOneInitialPosition(lastPage?: string) {
  if (lastPage === "/hall/center-front") {
    return { x: 8, y: 6, direction: "down" as const };
  }

  return { x: 8, y: 10, direction: "up" as const };
}
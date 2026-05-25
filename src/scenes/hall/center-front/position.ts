export function getCenterFrontInitialPosition(lastPage?: string) {
  if (lastPage === "/hall/thirdclass") {
    return { x: 10, y: 7, direction: "left" as const };
  }

  return { x: 8, y: 10, direction: "up" as const };
}
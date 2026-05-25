export function getThirdClassInitialPosition(lastPage?: string) {
  if (lastPage === "/hall/jailson-two") {
    return { x: 9, y: 4, direction: "left" as const };
  }

  return { x: 9, y: 10, direction: "up" as const };
}
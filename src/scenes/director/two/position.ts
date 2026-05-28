export function getDirectorTwoInitialPosition(lastPage?: string) {
  if (lastPage?.startsWith("/cantina")) {
    return { x: 4, y: 4, direction: "down" as const };
  }

  return { x: 9, y: 5, direction: "up" as const };
}
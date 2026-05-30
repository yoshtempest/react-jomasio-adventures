export function getDirectorTwoInitialPosition(lastPage?: LastPage) {
  if (lastPage?.startsWith("/cantina")) {
    return { x: 4, y: 4, direction: "down" };
  }

  return { x: 9, y: 5, direction: "up" };
}
export function getJailsonOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/hall/jailson-two") {
    return { x: 9, y: 4, direction: "left" };
  }

  return { x: 8, y: 10, direction: "up" };
}

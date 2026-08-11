export function getJailsonOneInitialPosition(
  lastPage?: LastPage,
): ExplorePosition {
  if (lastPage === "/hall/jailson-two") {
    return { x: 9, y: 2, direction: "up" };
  }

  return { x: 9, y: 11, direction: "up" };
}

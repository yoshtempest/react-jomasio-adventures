export function getJailsonTwoInitialPosition(
  lastPage?: LastPage
): ExplorePosition {
  if (lastPage === "/hall/jailson/battle") {
    return { x: 10, y: 2, direction: "down" };
  }
  return { x: 9, y: 11, direction: "up" };
}

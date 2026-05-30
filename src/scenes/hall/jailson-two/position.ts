export function getJailsonTwoInitialPosition(lastPage: LastPage) {
  if (lastPage === "/hall/jailson-two") {
    return { x: 9, y: 4, direction: "left" };
  }

  return { x: 9, y: 10, direction: "up" };
}
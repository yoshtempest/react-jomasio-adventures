export function getCenterFrontInitialPosition(lastPage: LastPage) {
  if (lastPage === "/hall/thirdclass") {
    return { x: 10, y: 7, direction: "left" };
  }

  return { x: 8, y: 10, direction: "up" };
}
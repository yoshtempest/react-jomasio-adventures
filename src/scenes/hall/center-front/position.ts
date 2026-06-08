export function getCenterFrontInitialPosition(lastPage?: LastPage) {
  if (lastPage === "/hall/thirdclass") {
    return { x: 11, y: 5, direction: "left" };
  }

  return { x: 8, y: 10, direction: "up" };
}
export function getThirdClassInitialPosition(lastPage?: LastPage) {
  if (lastPage === "/library") {
    return { x: 8, y: 6, direction: "down" };
  }

  if (lastPage === "/brodiclass/one") {
    return { x: 4, y: 7, direction: "right" };
  }

  return { x: 9, y: 10, direction: "up" };
}
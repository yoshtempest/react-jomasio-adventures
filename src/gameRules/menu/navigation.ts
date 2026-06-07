export function circularNext(index: number, length: number) {
  return index === length - 1 ? 0 : index + 1;
}

export function circularPrev(index: number, length: number) {
  return index === 0 ? length - 1 : index - 1;
}

export function gridMove(
  index: number,
  cols: number,
  direction: "up" | "down" | "left" | "right",
  length: number
) {
  if (direction === "down") {
    const next = index + cols;
    return next >= length ? index : next;
  }

  if (direction === "up") {
    const next = index - cols;
    return next < 0 ? index : next;
  }

  if (direction === "right") {
    const next = index + 1;
    return next >= length ? index : next;
  }

  const next = index - 1;
  return next < 0 ? index : next;
}
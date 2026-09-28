interface GetPlayerTransformParams {
  direction: Direction;
  rotationDeg: number;
  showFlipped: boolean;
  isCrouching: boolean;
  isFallen: boolean;
}

export function getPlayerTransform({
  direction,
  rotationDeg,
  showFlipped,
  isCrouching,
  isFallen,
}: GetPlayerTransformParams): string {
  const directionScale = direction === "left" ? -1 : 1;

  const rotation = rotationDeg !== 0 ? `rotate(${rotationDeg}deg)` : "";

  const stateTransform = showFlipped
    ? "scaleY(-1) translate(-50%, 80%)"
    : isCrouching
      ? "scale(0.7)"
      : isFallen
        ? "scale(0.7) translate(0, 20%)"
        : "";

  return `
    translateX(-50%)
    scaleX(${directionScale})
    ${rotation}
    ${stateTransform}
  `;
}

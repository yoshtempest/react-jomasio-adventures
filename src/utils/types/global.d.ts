export {};

declare global {
  type LastPage = string | undefined;

  type Direction = "up" | "down" | "left" | "right";

  type ExplorePosition = {
    x: number;
    y: number;
    direction: DirectionExplore;
  };
}
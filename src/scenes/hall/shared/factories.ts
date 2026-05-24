export const createDoorTile = (
  x: number,
  y: number,
  route: string
) => ({
  x,
  y,
  route,
});

import type {
  TileRouteFunction
} from "./types";

export const createConditionalTile = (
  x: number,
  y: number,
  getRoute: TileRouteFunction
) => ({
  x,
  y,
  getRoute,
});

export const createNpc = (
  src: string,
  gridX: number,
  gridY: number
) => ({
  src,
  gridX,
  gridY,
});

export const createPosition = (
  x: number,
  y: number,
  direction: "up" | "down" | "left" | "right"
) => ({
  x,
  y,
  direction,
});

export const createGiveQuestEvent = (
  questId: string
) => ({
  type: "giveQuest",
  questId,
});
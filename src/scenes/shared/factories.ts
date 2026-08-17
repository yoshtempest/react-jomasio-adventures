type ConditionalTileOptions = {
  blockedMessage?: string;
};

export const createDoorTile = (x: number, y: number, route: string) => ({
  x,
  y,
  route,
});

import type { TileRouteFunction } from "./types";

export const createConditionalTile = (
  x: number,
  y: number,
  getRoute: TileRouteFunction,
  options?: ConditionalTileOptions,
) => ({
  x,
  y,
  getRoute,
  blockedMessage: options?.blockedMessage,
});

export const createNpc = (
  src: string | NpcSrcResolver,
  gridX: number,
  gridY: number,
) => ({
  src,
  gridX,
  gridY,
});

export const createPlate = (
  src: string,
  gridX: number,
  gridY: number,
  message?: string,
) => ({
  src,
  gridX,
  gridY,
  ...(message ? { message } : {}),
});

export const createPosition = (
  x: number,
  y: number,
  direction: Direction,
): ExplorePosition => ({
  x,
  y,
  direction,
});

export const createGiveQuestEvent = (questId: string) => ({
  type: "giveQuest",
  questId,
});

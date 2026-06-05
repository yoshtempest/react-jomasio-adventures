import type { Quest } from "@/utils/types/player/quest";

export type Player = {
  x: number;
  y: number;
  direction: Direction;
};

export type TileRouteFunction = (
  player: Player,
  quests: Quest[]
) => string | null;
import type { QuestId } from "@/data/quests";

export type Player = {
  x: number;
  y: number;
  direction: Direction;
};

export type Quest = {
  id: QuestId;
};

export type TileRouteFunction = (
  player: Player,
  quests: Quest[]
) => string | null;
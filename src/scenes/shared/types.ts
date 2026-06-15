import type { Quest } from "@/utils/types/player/quest";

export type TileRouteFunction = (
  player: ExplorePosition,
  quests: Quest[],
) => string | null;

export type TileRouteFunction = (
  player: ExplorePosition,
  quests: Quest[],
  flags: FlagId[],
) => string | null;

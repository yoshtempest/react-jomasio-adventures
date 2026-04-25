import type { ExploreSceneProps } from "@/utils/types/maps/exploreScene";
import type { SceneEvent } from "./sceneEvents";

export type SceneId =
"one" |
"two" |
"three" |
"four" |
"five" |
"six" |
"seven" |
"afterpcroom/one" |
"afterpcroom/two" |
"left/one";

export type ExitTile = {
  x: number;
  y: number;
  route: string;
};

export type SceneConfig = Omit<
  ExploreSceneProps,
  "onInteract" | "className"
> & {
  id: SceneId;

  exitTile?: ExitTile[];

  events?: SceneEvent[];
};
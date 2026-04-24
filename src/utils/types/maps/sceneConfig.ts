import type { ExploreSceneProps } from "@/utils/types/maps/exploreScene";
import type { SceneEvent } from "./sceneEvents";

export type SceneId = "one" | "two" | "three" | "four" | "five" | "six" | "seven";

export type SceneConfig = Omit<
  ExploreSceneProps,
  "onInteract" | "className"
> & {
  id: SceneId;

  exitTile?: {
    x: number;
    y: number;
    route: string;
  };

  events?: SceneEvent[];
};
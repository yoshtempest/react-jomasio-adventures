import type { ExploreSceneProps } from "@/utils/types/exploreScene";

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

  events?: {
    onFinishType?: "classModal";
  };
};
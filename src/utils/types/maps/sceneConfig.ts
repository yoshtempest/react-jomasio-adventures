import type { ExploreSceneProps } from "@/utils/types/maps/exploreScene";
import type { SceneEvent } from "./sceneEvents";
import type { QuestId } from "@/data/quests";

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

  requiredQuest?: QuestId;
  blockedMessage?: string;
};

export type SceneConfig = Omit<
  ExploreSceneProps,
  "onInteract" | "className"
> & {
  id: SceneId;

  exitTile?: ExitTile[];

  events?: SceneEvent[];
};
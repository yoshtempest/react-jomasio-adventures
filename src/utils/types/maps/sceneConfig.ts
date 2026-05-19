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
"afterpcroom-one" |
"afterpcroom-two" |
"left-one" |
"center-one" |
"center-front" |
"thirdclass";

export type ExitTile = {
  x: number;
  y: number;
  route: string;

  requiredQuest?: QuestId;
  blockedMessage?: string;
};

type SceneTile = {
  x: number;
  y: number;

  getRoute?: (player: any, quests: any[]) => string | null;
  blockedMessage?: string;
};

export type SceneConfig = Omit<
  ExploreSceneProps,
  "onInteract" | "className"
> & {
  id: SceneId;

  className?: string;

  exitTile?: ExitTile[];

  events?: SceneEvent[];

  tiles?: SceneTile[];
};
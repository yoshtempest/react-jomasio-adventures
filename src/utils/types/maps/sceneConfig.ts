import type { ExploreSceneProps } from "@/utils/types/maps/exploreScene";
import type { SceneEvent } from "./sceneEvents";
import type { QuestId } from "@/data/quests";

export type SceneId =
"one" |
"two" |
"jailson-one" |
"jailson-two" |
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

type SceneTile = {
  x: number;
  y: number;

  // rota fixa (caso simples)
  route?: string;

  // rota dinâmica (caso avançado)
  getRoute?: (player: any, quests: any[]) => string | null;

  requiredQuest?: QuestId;

  blockedMessage?: string;
};

export type SceneConfig = Omit<
  ExploreSceneProps,
  "onInteract" | "className"
> & {
  id: SceneId;

  className?: string;

  events?: SceneEvent[];

  tiles?: SceneTile[];
};
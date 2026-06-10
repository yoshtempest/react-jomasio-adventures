import type { ExploreSceneProps } from "@/utils/types/maps/exploreScene";
import type { SceneEvent } from "./sceneEvents";
import type { Player } from "@/scenes/shared/types";
import type { Quest } from "@/utils/types/player/quest";

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
"eight" |
"nine" |
"afterpcroom-one" |
"left-one" |
"center-one" |
"center-two" |
"center-front" |
"thirdclass" |
"hell" |
"secret-passage" |
"footballcourt" |
"pandemony";

export type SceneTile = {
  x: number;
  y: number;

  // rota fixa (caso simples)
  route?: string;

  // rota dinâmica (caso avançado)
  getRoute?: (player: Player, quests: Quest[]) => string | null;

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
import { blocked } from "@/maps/blocked";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getHellroomDialogue } from "./dialogue";
import { hellroomNpcs } from "./npcs";
import { hellroomEvents } from "./events";
import { getHellroomOneInitialPosition } from "./position";

export const oneScene: SceneConfig = {
  id: "one",
  dialogueData: getHellroomDialogue,
  initialPosition: getHellroomOneInitialPosition,
  map: blocked,
  events: hellroomEvents,
  audio: { src: MUSICS.default },
  npcs: hellroomNpcs,
};

import { blocked } from "@/maps/blocked";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getDirectorDialogue } from "./dialogue";
import { directorNpcs } from "./npcs";
import { directorEvents } from "./events";
import { getDirectorOneInitialPosition } from "./position";

export const oneScene: SceneConfig = {
  id: "one",
  dialogueData: getDirectorDialogue,
  initialPosition: getDirectorOneInitialPosition,
  map: blocked,
  events: directorEvents,
  audio: { src: MUSICS.default },
  npcs: directorNpcs,
};

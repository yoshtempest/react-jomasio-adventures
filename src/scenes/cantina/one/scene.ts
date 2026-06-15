import { cantina } from "@/maps/cantina/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCantinaOneInitialPosition } from "./position";
import { getCantinaOneDialogue } from "./dialogue";
import { cantinaOneNpcs } from "./npcs";
import { cantinaOneEvents } from "./events";
import { cantinaOneTiles } from "./tiles";

export const oneScene: SceneConfig = {
  id: "one",
  map: cantina,
  events: cantinaOneEvents,
  npcs: cantinaOneNpcs,
  dialogueData: getCantinaOneDialogue,
  audio: { src: MUSICS.default },
  initialPosition: getCantinaOneInitialPosition,
  tiles: cantinaOneTiles,
};

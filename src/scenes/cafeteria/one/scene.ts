import { cafeteria } from "@/maps/cafeteria/one";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaOneInitialPosition } from "./position";
import { cafeteriaOneTiles } from "./tiles";
import { getCafeteriaOneDialogue } from "./dialogue";
import { cafeteriaOneNpcs } from "./npcs";
import { cafeteriaOneEvents } from "./events";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const oneScene: SceneConfig = {
  id: "one",
  background: sceneBackgrounds.Cafeteria,
  map: cafeteria,
  events: cafeteriaOneEvents,
  npcs: cafeteriaOneNpcs,
  dialogueData: getCafeteriaOneDialogue,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaOneInitialPosition,
  tiles: cafeteriaOneTiles,
};

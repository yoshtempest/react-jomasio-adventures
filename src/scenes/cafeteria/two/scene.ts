import { cafeteriaTwo } from "@/maps/cafeteria/two";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCafeteriaTwoInitialPosition } from "./position";
import { cafeteriaTwoNpcs } from "./npcs";
import { cafeteriaTwoEvents } from "./events";
import { getCafeteriaTwoDialogue } from "./dialogue";


export const twoScene: SceneConfig = {
  id: "two",
  className: "Cafeteria",
  map: cafeteriaTwo,
  dialogueData: getCafeteriaTwoDialogue,
  events: cafeteriaTwoEvents,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaTwoInitialPosition,
  npcs: cafeteriaTwoNpcs
};
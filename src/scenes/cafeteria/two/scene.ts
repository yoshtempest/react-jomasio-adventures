import { cafeteriaTwo } from "@/maps/cafeteria/two";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaTwoInitialPosition } from "./position";
import { cafeteriaTwoNpcs } from "./npcs";
import { cafeteriaTwoEvents } from "./events";
import { getCafeteriaTwoDialogue } from "./dialogue";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const twoScene: SceneConfig = {
  id: "two",
  background: sceneBackgrounds.Cafeteria,
  map: cafeteriaTwo,
  dialogueData: getCafeteriaTwoDialogue,
  events: cafeteriaTwoEvents,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaTwoInitialPosition,
  npcs: cafeteriaTwoNpcs,
};

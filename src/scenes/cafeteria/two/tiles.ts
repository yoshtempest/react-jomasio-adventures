import { cafeteriaTwo } from "@/maps/cafeteria/two";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaTwoInitialPosition } from "./position";
import { getCafeteriaTwoDialogue } from "./dialogue";
import { cafeteriaTwoNpcs } from "./npcs";
import { cafeteriaTwoEvents } from "./events";

export const cafeteriaTwoScene: SceneConfig = {
  id: "one",
  map: cafeteriaTwo,
  events: cafeteriaTwoEvents,
  dialogueData: getCafeteriaTwoDialogue,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaTwoInitialPosition,
  npcs: cafeteriaTwoNpcs,
};

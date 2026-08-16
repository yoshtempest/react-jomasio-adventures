import { cafeteriaTwo } from "@/maps/cafeteria/two";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaTwoInitialPosition } from "./position";
import { cafeteriaTwoNpcs } from "./npcs";
import { cafeteriaTwoEvents } from "./events";
import { getCafeteriaTwoDialogue } from "./dialogue";
import { sceneBackgrounds } from "@/data/scene/background";

export const twoScene: SceneConfig = {
  id: "two",
  background: sceneBackgrounds.Cafeteria,
  scaleFix: 1.7,
  map: cafeteriaTwo,
  dialogueData: getCafeteriaTwoDialogue,
  autoStartDialogue: true,
  events: cafeteriaTwoEvents,
  cutscene: {
    videoSrc: "/assets/videos/denisburn.webm",
    npcGridX: 18,
    npcGridY: 4.6,
  },
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaTwoInitialPosition,
  npcs: cafeteriaTwoNpcs,
};

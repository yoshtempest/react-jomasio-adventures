import { pcsRoomThree } from "@/maps/pcRoom/three";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomFourDialogue } from "./dialogue";
import { pcRoomFourNpcs } from "./npcs";
import { pcRoomFourEvents } from "./events";

export const fourScene: SceneConfig = {
  id: "four",
  dialogueData: getPcRoomFourDialogue,
  map: pcsRoomThree,
  events: pcRoomFourEvents,
  audio: { src: MUSICS.monkeyCircle },
  npcs: pcRoomFourNpcs,
};

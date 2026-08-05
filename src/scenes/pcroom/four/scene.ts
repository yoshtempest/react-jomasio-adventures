import { pcsRoomThree } from "@/maps/pcRoom/three";
import { MUSICS } from "@/scenes/shared/music";
import { getPcRoomFourDialogue } from "./dialogue";
import { pcRoomFourNpcs } from "./npcs";
import { pcRoomFourEvents } from "./events";

export const fourScene: SceneConfig = {
  id: "four",
  dialogueData: getPcRoomFourDialogue,
  map: pcsRoomThree,
  scaleFix: 2,
  events: pcRoomFourEvents,
  audio: { src: MUSICS.monkeyCircle },
  npcs: pcRoomFourNpcs,
};

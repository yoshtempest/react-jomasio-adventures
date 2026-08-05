import { pcsRoomFive } from "@/maps/pcRoom/five";
import { MUSICS } from "@/scenes/shared/music";
import { getPcRoomFiveDialogue } from "./dialogue";
import { pcRoomFiveNpcs } from "./npcs";
import { pcRoomFiveEvents } from "./events";

export const fiveScene: SceneConfig = {
  id: "five",
  dialogueData: getPcRoomFiveDialogue,
  map: pcsRoomFive,
  scaleFix: 2,
  events: pcRoomFiveEvents,
  audio: { src: MUSICS.monkeyCircle },
  npcs: pcRoomFiveNpcs,
};

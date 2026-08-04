import { pcsRoomTwo } from "@/maps/pcRoom/two";
import { MUSICS } from "@/scenes/shared/music";
import { getPcRoomTwoDialogue } from "./dialogue";
import { pcRoomTwoNpcs } from "./npcs";
import { pcRoomTwoEvents } from "./events";
import { pcRoomOneTiles } from "../one/tiles";

export const twoScene: SceneConfig = {
  id: "two",
  dialogueData: getPcRoomTwoDialogue,
  map: pcsRoomTwo,
  events: pcRoomTwoEvents,
  audio: { src: MUSICS.monkeyCircle },
  npcs: pcRoomTwoNpcs,
  tiles: pcRoomOneTiles,
};

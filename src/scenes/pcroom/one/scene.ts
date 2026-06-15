import { pcsRoom } from "@/maps/pcRoom/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomOneDialogue } from "./dialogue";
import { pcRoomOneNpcs } from "./npcs";
import { getPcRoomOneInitialPosition } from "./position";
import { pcRoomOneTiles } from "./tiles";
import { pcRoomOneEvents } from "./events";

export const oneScene: SceneConfig = {
  id: "one",
  dialogueData: getPcRoomOneDialogue,
  map: pcsRoom,
  events: pcRoomOneEvents,
  audio: { src: MUSICS.monkeyCircle },
  npcs: pcRoomOneNpcs,
  initialPosition: getPcRoomOneInitialPosition,
  tiles: pcRoomOneTiles,
};

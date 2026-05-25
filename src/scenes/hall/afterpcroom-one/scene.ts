import { afterPcRoom } from "@/maps/hall/afterPcRoom";
import { getAfterPcRoomOneDialogue } from "./dialogue"
import { afterPcRoomOneTiles } from "./tiles";
import { afterPcRoomOneEvents } from "./events";
import { afterPcRoomOneNpcs } from "./npcs";
import { getAfterPcRoomOneInitialPosition } from "./position";
import { HALL_MUSIC } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const afterPcRoomOneScene: SceneConfig = {
  id: "afterpcroom-one",
  dialogueData: getAfterPcRoomOneDialogue,
  map: afterPcRoom,
  audio: { src: HALL_MUSIC.jailson },
  npcs: afterPcRoomOneNpcs,
  initialPosition: getAfterPcRoomOneInitialPosition,
  events: afterPcRoomOneEvents,
  tiles: afterPcRoomOneTiles,
};
import { afterPcRoom } from "@/maps/hall/afterPcRoom";
import { getAfterPcRoomOneDialogue } from "./dialogue";
import { afterPcRoomOneTiles } from "./tiles";
import { afterPcRoomOneEvents } from "./events";
import { afterPcRoomOneNpcs } from "./npcs";
import { getAfterPcRoomOneInitialPosition } from "./position";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const afterPcRoomScene: SceneConfig = {
  id: "afterpcroom-one",
  className: "HallOne",
  dialogueData: getAfterPcRoomOneDialogue,
  map: afterPcRoom,
  audio: { src: MUSICS.default },
  npcs: afterPcRoomOneNpcs,
  initialPosition: getAfterPcRoomOneInitialPosition,
  events: afterPcRoomOneEvents,
  tiles: afterPcRoomOneTiles,
};

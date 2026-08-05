import { afterPcRoom } from "@/maps/hall/afterPcRoom";
import { getAfterPcRoomOneDialogue } from "./dialogue";
import { afterPcRoomOneTiles } from "./tiles";
import { afterPcRoomOneEvents } from "./events";
import { afterPcRoomOneNpcs } from "./npcs";
import { MUSICS } from "@/scenes/shared/music";
import { sceneBackgrounds } from "@/data/scene/background";
import { getHallOneInitialPosition } from "../one/position";

export const afterPcRoomScene: SceneConfig = {
  id: "afterpcroom-one",
  background: sceneBackgrounds.HallOne,
  scaleFix: 1.4,
  dialogueData: getAfterPcRoomOneDialogue,
  map: afterPcRoom,
  audio: { src: MUSICS.default },
  npcs: afterPcRoomOneNpcs,
  initialPosition: getHallOneInitialPosition,
  events: afterPcRoomOneEvents,
  tiles: afterPcRoomOneTiles,
};

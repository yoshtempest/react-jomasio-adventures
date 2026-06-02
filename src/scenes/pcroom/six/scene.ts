import { pcsRoomSix } from "@/maps/pcRoom/six";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { pcRoomSixTiles } from "./tiles";
import { getPcRoomSixInitialPosition } from "./position";


export const sixScene: SceneConfig = {
  id: "six",
  map: pcsRoomSix,
  audio: { src: MUSICS.monkeyCircle },
  tiles: pcRoomSixTiles,
  initialPosition: getPcRoomSixInitialPosition,
};
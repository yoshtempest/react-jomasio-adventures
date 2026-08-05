import { pcsRoomSix } from "@/maps/pcRoom/six";
import { MUSICS } from "@/scenes/shared/music";
import { pcRoomSixTiles } from "./tiles";
import { getPcRoomSixInitialPosition } from "./position";

export const sixScene: SceneConfig = {
  id: "six",
  map: pcsRoomSix,
  scaleFix: 2,
  audio: { src: MUSICS.monkeyCircle },
  tiles: pcRoomSixTiles,
  initialPosition: getPcRoomSixInitialPosition,
};

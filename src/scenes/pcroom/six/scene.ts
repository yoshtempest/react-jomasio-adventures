import { pcsRoom } from "@/maps/pcRoom/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";


export const pcRoomSixScene: SceneConfig = {
  id: "six",
  map: pcsRoom,
  audio: { src: MUSICS.monkeyCircle },
};
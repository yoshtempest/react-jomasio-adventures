import { hallTwoCenter } from "@/maps/hall/centerTwo";
import { MUSICS } from "@/scenes/shared/music";
import { centerTwoTiles } from "./tiles";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCenterTwoInitialPosition } from "./position";
import { centerTwoNpcs } from "./npcs";
import { getHallCenterDialogue } from "./dialogue";
import { hallCenterTwoEvents } from "./events";

export const centerTwoScene: SceneConfig = {
  id: "center-two",
  className: "HallCenter",
  events: hallCenterTwoEvents,
  dialogueData: getHallCenterDialogue,
  tiles: centerTwoTiles,
  initialPosition: getCenterTwoInitialPosition,
  map: hallTwoCenter,
  npcs: centerTwoNpcs,
  audio: { src: MUSICS.default },
};

import { hallTwoCenter } from "@/maps/hall/centerTwo";
import { MUSICS } from "@/scenes/shared/music";
import { centerOneTiles } from "../center-one/tiles";
import { getCenterOneInitialPosition } from "../center-one/position";
import { centerTwoNpcs } from "./npcs";
import { getHallCenterDialogue } from "./dialogue";
import { hallCenterTwoEvents } from "./events";
import { centerOnePlates } from "../center-one/plate";
import { sceneBackgrounds } from "@/data/scene/background";

export const centerTwoScene: SceneConfig = {
  id: "center-two",
  background: sceneBackgrounds.HallCenter,
  scaleFix: 1.4,
  events: hallCenterTwoEvents,
  dialogueData: getHallCenterDialogue,
  tiles: centerOneTiles,
  initialPosition: getCenterOneInitialPosition,
  map: hallTwoCenter,
  npcs: centerTwoNpcs,
  plates: centerOnePlates,
  audio: { src: MUSICS.default },
  tombstoneLocationId: "hall",
};

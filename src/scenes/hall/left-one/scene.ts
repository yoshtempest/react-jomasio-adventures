import { hallLeft } from "@/maps/hall/left";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getHallLeftDialogue } from "./dialogue"
import { leftOneNpcs } from "./npcs";
import { getHallLeftOneInitialPosition } from "./position";
import { hallLeftOneTiles } from "./tiles";


export const leftOneScene: SceneConfig = {
  id: "left-one",
  className: "HallLeft",
  dialogueData: getHallLeftDialogue,
  map: hallLeft,
  audio: { src: MUSICS.default },
  npcs: leftOneNpcs,
  initialPosition: getHallLeftOneInitialPosition,
  tiles: hallLeftOneTiles,
};
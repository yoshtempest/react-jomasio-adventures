import { hallLeft } from "@/maps/hall/left";
import { MUSICS } from "@/scenes/shared/music";
import { getHallLeftDialogue } from "./dialogue";
import { leftOneNpcs } from "./npcs";
import { getHallLeftOneInitialPosition } from "./position";
import { hallLeftOneTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const leftOneScene: SceneConfig = {
  id: "left-one",
  background: sceneBackgrounds.HallLeft,
  dialogueData: getHallLeftDialogue,
  map: hallLeft,
  audio: { src: MUSICS.default },
  npcs: leftOneNpcs,
  initialPosition: getHallLeftOneInitialPosition,
  tiles: hallLeftOneTiles,
};

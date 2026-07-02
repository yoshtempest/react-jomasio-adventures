import { hallThirdClass } from "@/maps/hall/thirdClass";
import { MUSICS } from "@/scenes/shared/music";
import { getThirdClassInitialPosition } from "./position";
import { hallThirdClassTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const thirdClassScene: SceneConfig = {
  id: "thirdclass",
  background: sceneBackgrounds.HallThirdClass,
  initialPosition: getThirdClassInitialPosition,
  map: hallThirdClass,
  audio: { src: MUSICS.default },
  tiles: hallThirdClassTiles,
};

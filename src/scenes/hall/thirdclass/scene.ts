import { hallThirdClass } from "@/maps/hall/thirdClass";
import { MUSICS } from "@/scenes/shared/music";
import { getThirdClassInitialPosition } from "./position";
import { hallThirdClassTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const thirdClassScene: SceneConfig = {
  id: "thirdclass",
  background: sceneBackgrounds.HallThirdClass,
  backgroundSize: "100% 100%",
  scaleFix: 1.4,
  initialPosition: getThirdClassInitialPosition,
  map: hallThirdClass,
  audio: { src: MUSICS.default },
  tiles: hallThirdClassTiles,
};

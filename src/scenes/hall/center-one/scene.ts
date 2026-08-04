import { hallCenter } from "@/maps/hall/center";
import { MUSICS } from "@/scenes/shared/music";
import { centerOneTiles } from "./tiles";
import { getCenterOneInitialPosition } from "./position";
import { centerOnePlates } from "./plate";
import { sceneBackgrounds } from "@/data/scene/background";

export const centerOneScene: SceneConfig = {
  id: "center-one",
  background: sceneBackgrounds.HallCenter,
  backgroundSize: "100% 100%",
  tiles: centerOneTiles,
  initialPosition: getCenterOneInitialPosition,
  map: hallCenter,
  plates: centerOnePlates,
  audio: { src: MUSICS.default },
};

import { hallCenter } from "@/maps/hall/center";
import { MUSICS } from "@/scenes/shared/music";
import { centerOneTiles } from "./tiles";
import { getCenterOneInitialPosition } from "./position";
import { centerOnePlates } from "./plate";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const centerOneScene: SceneConfig = {
  id: "center-one",
  background: sceneBackgrounds.HallCenter,
  tiles: centerOneTiles,
  initialPosition: getCenterOneInitialPosition,
  map: hallCenter,
  plates: centerOnePlates,
  audio: { src: MUSICS.default },
};

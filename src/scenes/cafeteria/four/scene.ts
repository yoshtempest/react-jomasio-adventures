import { cafeteriaFour } from "@/maps/cafeteria/four";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaFourInitialPosition } from "./position";
import { cafeteriaFourTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const fourScene: SceneConfig = {
  id: "four",
  background: sceneBackgrounds.Cafeteria,
  map: cafeteriaFour,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaFourInitialPosition,
  tiles: cafeteriaFourTiles,
};

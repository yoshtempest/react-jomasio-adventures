import { director, directorLevels } from "@/maps/director";
import { MUSICS } from "@/scenes/shared/music";
import { getDirectorTwoInitialPosition } from "./position";

export const twoScene: SceneConfig = {
  id: "two",
  initialPosition: getDirectorTwoInitialPosition,
  map: director,
  heightMap: directorLevels,
  scaleFix: 1.6,
  audio: { src: MUSICS.default },
};

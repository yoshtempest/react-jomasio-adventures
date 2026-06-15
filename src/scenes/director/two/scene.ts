import { director } from "@/maps/director";
import { MUSICS } from "@/scenes/shared/music";
import { getDirectorTwoInitialPosition } from "./position";

export const twoScene: SceneConfig = {
  id: "two",
  initialPosition: getDirectorTwoInitialPosition,
  map: director,
  audio: { src: MUSICS.default },
};

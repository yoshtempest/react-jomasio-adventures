import { firstScreen } from "@/maps/firstScreen";
import { MUSICS } from "@/scenes/shared/music";
import { getFirstScreenInitialPosition } from "./position";
import { firstScreenTiles } from "./tiles";
import { firstScreenPlates } from "./plate"

export const oneScene: SceneConfig = {
  id: "one",
  map: firstScreen,
  scaleFix: 1.4,
  audio: { src: MUSICS.default },
  initialPosition: getFirstScreenInitialPosition,
  tiles: firstScreenTiles,
  plates: firstScreenPlates,
};

import { jomasioEntrance } from "@/maps/jomasioEntrance";
import { MUSICS } from "@/scenes/shared/music";
import {
  applyRocksToMap,
  buildRockHeightMap,
} from "@/gameRules/movement/rocks";
import { getJomasioEntranceInitialPosition } from "./position";
import { jomasioEntranceTiles } from "./tiles";
import { jomasioEntrancePlates } from "./plate";
import { jomasioEntranceRocks } from "./rocks";

export const oneScene: SceneConfig = {
  id: "one",
  map: applyRocksToMap(jomasioEntrance, jomasioEntranceRocks),
  heightMap: buildRockHeightMap(jomasioEntrance, jomasioEntranceRocks),
  scaleFix: 1.4,
  audio: { src: MUSICS.default },
  initialPosition: getJomasioEntranceInitialPosition,
  tiles: jomasioEntranceTiles,
  plates: jomasioEntrancePlates,
};

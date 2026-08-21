import { jomasioEntrance } from "@/maps/jomasioEntrance";
import { MUSICS } from "@/scenes/shared/music";
import { getJomasioEntranceInitialPosition } from "./position";
import { jomasioEntranceTiles } from "./tiles";
import { jomasioEntrancePlates } from "./plate";

export const oneScene: SceneConfig = {
  id: "one",
  map: jomasioEntrance,
  scaleFix: 1.4,
  audio: { src: MUSICS.default },
  initialPosition: getJomasioEntranceInitialPosition,
  tiles: jomasioEntranceTiles,
  plates: jomasioEntrancePlates,
};

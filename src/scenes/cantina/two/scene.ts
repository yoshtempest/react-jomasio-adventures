import { cantinaTwo } from "@/maps/cantina/two";
import { MUSICS } from "@/scenes/shared/music";
import { getCantinaTwoInitialPosition } from "./position";
import { cantinaTwoTiles } from "./tiles";
import { cantinaTwoPlates } from "./plate";

export const twoScene: SceneConfig = {
  id: "two",
  map: cantinaTwo,
  audio: { src: MUSICS.default },
  initialPosition: getCantinaTwoInitialPosition,
  tiles: cantinaTwoTiles,
  plates: cantinaTwoPlates,
};

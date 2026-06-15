import { cantinaTwo } from "@/maps/cantina/two";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCantinaTwoInitialPosition } from "./position";
import { cantinaTwoTiles } from "./tiles";

export const twoScene: SceneConfig = {
  id: "two",
  map: cantinaTwo,
  audio: { src: MUSICS.default },
  initialPosition: getCantinaTwoInitialPosition,
  tiles: cantinaTwoTiles,
};

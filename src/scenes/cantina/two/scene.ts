import { MUSICS } from "@/scenes/shared/music";
import { getCantinaTwoInitialPosition } from "./position";
import { cantinaTwoTiles } from "./tiles";
import { cantinaTwoPlates } from "./plate";
import { cantinaTwoNpcs } from "./npcs";
import { cantinaTwo } from "@/maps/cantina/two";

export const twoScene: SceneConfig = {
  id: "two",
  map: cantinaTwo,
  scaleFix: 2,
  audio: { src: MUSICS.default },
  npcs: cantinaTwoNpcs,
  initialPosition: getCantinaTwoInitialPosition,
  tiles: cantinaTwoTiles,
  plates: cantinaTwoPlates,
};

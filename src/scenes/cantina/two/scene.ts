import { MUSICS } from "@/scenes/shared/music";
import { getCantinaTwoInitialPosition } from "./position";
import { cantinaTwoTiles } from "./tiles";
import { cantinaTwoPlates } from "./plate";
import { cantinaTwoNpcs } from "./npcs";
import { cantina } from "@/maps/cantina/one";

export const twoScene: SceneConfig = {
  id: "two",
  map: cantina,
  scaleFix: 2,
  audio: { src: MUSICS.default },
  npcs: cantinaTwoNpcs,
  initialPosition: getCantinaTwoInitialPosition,
  tiles: cantinaTwoTiles,
  plates: cantinaTwoPlates,
};

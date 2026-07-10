import { MUSICS } from "@/scenes/shared/music";
import { getCantinaTwoInitialPosition } from "./position";
import { cantinaTwoTiles } from "./tiles";
import { cantinaTwoPlates } from "./plate";
import { cantinaTwoNpcs } from "./npcs";
import { cantina } from "@/maps/cantina/one";

export const nineScene: SceneConfig = {
  id: "two",
  map: cantina,
  audio: { src: MUSICS.default },
  npcs: cantinaTwoNpcs,
  initialPosition: getCantinaTwoInitialPosition,
  tiles: cantinaTwoTiles,
  plates: cantinaTwoPlates,
};

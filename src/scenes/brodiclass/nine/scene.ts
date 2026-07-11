import { MUSICS } from "@/scenes/shared/music";
import { getBrodiClassNineInitialPosition } from "./position";
import { brodiclassTwoTiles } from "./tiles";
import { cantinaTwoNpcs } from "./npcs";
import { cantina } from "@/maps/cantina/one";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const nineScene: SceneConfig = {
  id: "two",
  background: sceneBackgrounds.BrodiClass,
  map: cantina,
  audio: { src: MUSICS.default },
  npcs: cantinaTwoNpcs,
  initialPosition: getBrodiClassNineInitialPosition,
  tiles: brodiclassTwoTiles,
};

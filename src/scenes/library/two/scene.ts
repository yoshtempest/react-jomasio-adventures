import { libraryTwo } from "@/maps/library/two";
import { MUSICS } from "@/scenes/shared/music";
import { getCantinaTwoInitialPosition } from "./position";
import { cantinaTwoTiles } from "./tiles";

export const twoScene: SceneConfig = {
  id: "two",
  map: libraryTwo,
  className: "LibraryPassageOpened",
  audio: { src: MUSICS.default },
  initialPosition: getCantinaTwoInitialPosition,
  tiles: cantinaTwoTiles,
};

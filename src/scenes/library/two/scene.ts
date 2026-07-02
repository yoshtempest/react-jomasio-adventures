import { libraryTwo } from "@/maps/library/two";
import { MUSICS } from "@/scenes/shared/music";
import { getCantinaTwoInitialPosition } from "./position";
import { cantinaTwoTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const twoScene: SceneConfig = {
  id: "two",
  map: libraryTwo,
  background: sceneBackgrounds.LibraryPassageOpened,
  audio: { src: MUSICS.default },
  initialPosition: getCantinaTwoInitialPosition,
  tiles: cantinaTwoTiles,
};

import { library } from "@/maps/library/one";
import { MUSICS } from "@/scenes/shared/music";
import { sceneBackgrounds } from "@/data/sceneBackground";
import { getLibraryOneInitialPosition } from "./position";
import { libraryOneTiles } from "./tiles";

export const oneScene: SceneConfig = {
  id: "one",
  map: library,
  background: sceneBackgrounds.Library,
  audio: { src: MUSICS.default },
  initialPosition: getLibraryOneInitialPosition,
  tiles: libraryOneTiles,
};

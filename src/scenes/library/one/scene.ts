import { library } from "@/maps/library/one";
import { MUSICS } from "@/scenes/shared/music";
import { sceneBackgrounds } from "@/data/scene/background";
import { getLibraryOneInitialPosition } from "./position";
import { libraryOneTiles } from "./tiles";

export const oneScene: SceneConfig = {
  id: "one",
  map: library,
  scaleFix: 1.4,
  background: sceneBackgrounds.Library,
  audio: { src: MUSICS.default },
  initialPosition: getLibraryOneInitialPosition,
  tiles: libraryOneTiles,
  tombstoneLocationId: "library",
};

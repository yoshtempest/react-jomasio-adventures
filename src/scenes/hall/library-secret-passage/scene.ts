import { librarySecretPassage } from "@/maps/hall/librarySecretPassage";
import { getHallLibrarySecretPassageInitialPosition } from "./position";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { librarySecretPassageTiles } from "./tiles";


export const oneScene: SceneConfig = {
  id: "one",
  className: "LibrarySecretPassage",
  initialPosition: getHallLibrarySecretPassageInitialPosition,
  map: librarySecretPassage,
  audio: { src: MUSICS.default },
  tiles: librarySecretPassageTiles,
};
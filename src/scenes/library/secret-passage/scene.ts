import { librarySecretPassage } from "@/maps/hall/librarySecretPassage";
import { getSecretPassageInitialPosition } from "./position";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { secretPassageTiles } from "./tiles";

export const secretPassageScene: SceneConfig = {
  id: "one",
  className: "LibrarySecretPassage",
  initialPosition: getSecretPassageInitialPosition,
  map: librarySecretPassage,
  audio: { src: MUSICS.default },
  tiles: secretPassageTiles,
};

import { librarySecretPassage } from "@/maps/hall/librarySecretPassage";
import { getSecretPassageInitialPosition } from "./position";
import { MUSICS } from "@/scenes/shared/music";
import { secretPassageTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const secretPassageScene: SceneConfig = {
  id: "one",
  background: sceneBackgrounds.LibrarySecretPassage,
  initialPosition: getSecretPassageInitialPosition,
  map: librarySecretPassage,
  audio: { src: MUSICS.default },
  tiles: secretPassageTiles,
};

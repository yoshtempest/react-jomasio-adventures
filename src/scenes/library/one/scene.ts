import { library } from "@/maps/library";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getLibraryOneInitialPosition } from "./position";
import { libraryOneTiles } from "./tiles";


export const oneScene: SceneConfig = {
    id: "one",
    map: library,
    audio: { src: MUSICS.default },
    initialPosition: getLibraryOneInitialPosition,
    tiles: libraryOneTiles,
};
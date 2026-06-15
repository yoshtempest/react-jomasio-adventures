import { footballCourtTwo } from "@/maps/footballCourt/two";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCantinaTwoInitialPosition } from "./position";
import { footballCourtTwoTiles } from "./tiles";

export const twoScene: SceneConfig = {
  id: "two",
  map: footballCourtTwo,
  audio: { src: MUSICS.default },
  initialPosition: getCantinaTwoInitialPosition,
  tiles: footballCourtTwoTiles,
};

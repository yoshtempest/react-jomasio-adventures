import { footballCourtTwo } from "@/maps/footballCourt/two";
import { MUSICS } from "@/scenes/shared/music";
import { getCantinaTwoInitialPosition } from "./position";
import { footballCourtTwoTiles } from "./tiles";

export const twoScene: SceneConfig = {
  id: "two",
  map: footballCourtTwo,
  audio: { src: MUSICS.default },
  initialPosition: getCantinaTwoInitialPosition,
  tiles: footballCourtTwoTiles,
};

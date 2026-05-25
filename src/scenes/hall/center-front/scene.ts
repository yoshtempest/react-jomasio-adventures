import { hallCenterFront } from "@/maps/hall/centerFront";
import { hallCenterFrontTiles } from "./tiles";
import { getCenterFrontInitialPosition } from "./position";
import { HALL_MUSIC } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const centerFrontScene: SceneConfig = {
  id: "center-front",
  className: "HallCenterFront",
  map: hallCenterFront,
  audio: { src: HALL_MUSIC.jailson },
  initialPosition: getCenterFrontInitialPosition,
  tiles: hallCenterFrontTiles,
};
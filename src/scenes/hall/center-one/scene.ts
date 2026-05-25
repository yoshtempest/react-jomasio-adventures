import { hallCenter } from "@/maps/hall/center";

import { HALL_MUSIC } from "@/scenes/shared/music";
import { centerOneTiles } from "./tiles";

import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const centerOneScene: SceneConfig = {
  id: "center-one",
  tiles: centerOneTiles,
  map: hallCenter,
  audio: { src: HALL_MUSIC.default },
};
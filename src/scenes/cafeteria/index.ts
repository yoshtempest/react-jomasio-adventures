import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";
import { threeScene } from "./three/scene";
import { fourScene } from "./four/scene";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const CAFETERIA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
  three: threeScene,
  four: fourScene,
};
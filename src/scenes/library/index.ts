import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";
import { threeScene } from "./secret-passage/scene";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const LIBRARY_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
  three: threeScene,
};
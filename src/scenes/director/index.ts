import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const DIRECTOR_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
};
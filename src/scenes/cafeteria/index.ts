import { cafeteriaOneScene } from "./one/scene";
import { cafeteriaTwoScene } from "./two/scene";
import { cafeteriaThreeScene } from "./three/scene";
import { cafeteriaFourScene } from "./four/scene";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const CAFETERIA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: cafeteriaOneScene,
  two: cafeteriaTwoScene,
  three: cafeteriaThreeScene,
  four: cafeteriaFourScene,
};
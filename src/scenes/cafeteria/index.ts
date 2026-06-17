import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";
import { threeScene } from "./three/scene";
import { fourScene } from "./four/scene";

export const CAFETERIA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
  three: threeScene,
  four: fourScene,
};

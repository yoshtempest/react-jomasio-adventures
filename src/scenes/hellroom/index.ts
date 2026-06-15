import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";
import { threeScene } from "./three/scene";


export const HELLROOM_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
  three: threeScene,
};

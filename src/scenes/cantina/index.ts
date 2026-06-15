import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";


export const CANTINA_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
};

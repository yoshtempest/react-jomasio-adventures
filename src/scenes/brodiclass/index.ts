import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";
import { nineScene } from "./nine/scene";

export const BRODICLASS_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
  nine: nineScene,
};

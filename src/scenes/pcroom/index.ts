import { oneScene } from "./one/scene";
import { twoScene } from "./two/scene";
import { threeScene } from "./three/scene";
import { fourScene } from "./four/scene";
import { fiveScene } from "./five/scene";
import { sixScene } from "./six/scene";
import { sevenScene } from "./seven/scene";


export const PCROOM_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  two: twoScene,
  three: threeScene,
  four: fourScene,
  five: fiveScene,
  six: sixScene,
  seven: sevenScene,
};

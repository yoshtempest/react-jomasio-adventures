import { oneScene } from "./one/scene";

export { jomasioEntranceRocks } from "./one/rocks";

export const JOMASIO_ENTRANCE_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
};

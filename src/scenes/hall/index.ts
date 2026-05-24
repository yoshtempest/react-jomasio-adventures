import { hallOneScene } from "./one/scene";
import { jailsonOneScene } from "./jailson-one/scene";
import { jailsonTwoScene } from "./jailson-two/scene";
import { afterPcRoomScene } from "./afterpcroom-one/scene";
import { thirdclassScene } from "./thirdclass/scene";
import { hallCenterFrontScene } from "./center-front/scene";
import { hallCenterOneScene } from "./center-one/scene";
import { leftOneScene } from "./left-one/scene";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const HALL_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: hallOneScene,
  "jailson-one": jailsonOneScene,
  "jailson-two": jailsonTwoScene,
  "afterpcroom-one": afterPcRoomScene,
  thirdclass: thirdclassScene,
  centerFront: hallCenterFrontScene,
  centerOne: hallCenterOneScene,
  leftOne: leftOneScene
};
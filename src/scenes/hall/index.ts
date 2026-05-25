import { oneScene } from "./one/scene";
import { jailsonOneScene } from "./jailson-one/scene";
import { jailsonTwoScene } from "./jailson-two/scene";
import { afterPcRoomScene } from "./afterpcroom-one/scene";
import { thirdClassScene } from "./thirdclass/scene";
import { centerFrontScene } from "./center-front/scene";
import { centerOneScene } from "./center-one/scene";
import { leftOneScene } from "./left-one/scene";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const HALL_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: oneScene,
  "jailson-one": jailsonOneScene,
  "jailson-two": jailsonTwoScene,
  "afterpcroom-one": afterPcRoomScene,
  thirdclass: thirdClassScene,
  "center-front": centerFrontScene,
  "center-one": centerOneScene,
  "left-one": leftOneScene
};
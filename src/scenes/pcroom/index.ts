import { pcRoomOneScene } from "./one/scene";
import { pcRoomTwoScene } from "./two/scene";
import { pcRoomThreeScene } from "./three/scene";
import { pcRoomFourScene } from "./four/scene";
import { pcRoomFiveScene } from "./five/scene";
import { pcRoomSixScene } from "./six/scene";

import type { SceneConfig, SceneId } from "@/utils/types/maps/sceneConfig";

export const PCROOM_SCENES: Partial<Record<SceneId, SceneConfig>> = {
  one: pcRoomOneScene,
  two: pcRoomTwoScene,
  three: pcRoomThreeScene,
  four: pcRoomFourScene,
  five: pcRoomFiveScene,
  six: pcRoomSixScene,
};
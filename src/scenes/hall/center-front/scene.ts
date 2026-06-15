import { hallCenterFront } from "@/maps/hall/centerFront";
import { hallCenterFrontTiles } from "./tiles";
import { getCenterFrontInitialPosition } from "./position";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { centerFrontNpcs } from "./npcs";
import { getCenterFrontDialogue } from "./dialogue";

export const centerFrontScene: SceneConfig = {
  id: "center-front",
  className: "HallCenterFront",
  dialogueData: getCenterFrontDialogue,
  map: hallCenterFront,
  npcs: centerFrontNpcs,
  audio: { src: MUSICS.default },
  initialPosition: getCenterFrontInitialPosition,
  tiles: hallCenterFrontTiles,
};

import { hallCenterFront } from "@/maps/hall/centerFront";
import { hallCenterFrontTiles } from "./tiles";
import { getCenterFrontInitialPosition } from "./position";
import { MUSICS } from "@/scenes/shared/music";
import { centerFrontNpcs } from "./npcs";
import { getCenterFrontDialogue } from "./dialogue";
import { sceneBackgrounds } from "@/data/scene/background";

export const centerFrontScene: SceneConfig = {
  id: "center-front",
  background: sceneBackgrounds.HallCenterFront,
  scaleFix: 1.4,
  dialogueData: getCenterFrontDialogue,
  map: hallCenterFront,
  npcs: centerFrontNpcs,
  audio: { src: MUSICS.default },
  initialPosition: getCenterFrontInitialPosition,
  tiles: hallCenterFrontTiles,
};

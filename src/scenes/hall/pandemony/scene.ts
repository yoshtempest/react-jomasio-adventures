import { MUSICS } from "@/scenes/shared/music";
import { pandemonyTiles } from "./tiles";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPandemonyInitialPosition } from "./position";
import { hallPandemony } from "@/maps/hall/pandemony";
import { pandemonyNpcs } from "./npcs";
import { getPandemonyDialogue } from "./dialogue";
import { pandemonyEvents } from "./events";

export const pandemonyScene: SceneConfig = {
  id: "pandemony",
  className: "HallPandemony",
  tiles: pandemonyTiles,
  initialPosition: getPandemonyInitialPosition,
  map: hallPandemony,
  audio: { src: MUSICS.default },
  npcs: pandemonyNpcs,
  dialogueData: getPandemonyDialogue,
  events: pandemonyEvents,
};

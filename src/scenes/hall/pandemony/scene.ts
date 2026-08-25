import { MUSICS } from "@/scenes/shared/music";
import { pandemonyTiles } from "./tiles";
import { getPandemonyInitialPosition } from "./position";
import { hallPandemony } from "@/maps/hall/pandemony";
import { pandemonyNpcs } from "./npcs";
import { getPandemonyDialogue } from "./dialogue";
import { pandemonyEvents } from "./events";
import { sceneBackgrounds } from "@/data/scene/background";

export const pandemonyScene: SceneConfig = {
  id: "pandemony",
  background: sceneBackgrounds.HallPandemony,
  scaleFix: 1.4,
  tiles: pandemonyTiles,
  initialPosition: getPandemonyInitialPosition,
  map: hallPandemony,
  audio: { src: MUSICS.hell },
  npcs: pandemonyNpcs,
  dialogueData: getPandemonyDialogue,
  events: pandemonyEvents,
  tombstoneLocationId: "hall",
};

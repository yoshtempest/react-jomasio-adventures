import { hallHell } from "@/maps/hall/hell";
import { MUSICS } from "@/scenes/shared/music";
import { hellTiles } from "./tiles";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getHellInitialPosition } from "./position";
import { hellNpcs } from "./npcs";
import { getHellDialogue } from "./dialogue";
import { hellEvents } from "./events";

export const hellScene: SceneConfig = {
  id: "hell",
  className: "HallHell",
  dialogueData: getHellDialogue,
  tiles: hellTiles,
  events: hellEvents,
  initialPosition: getHellInitialPosition,
  map: hallHell,
  audio: { src: MUSICS.default },
  npcs: hellNpcs,
};
import { hallHell } from "@/maps/hall/hell";
import { MUSICS } from "@/scenes/shared/music";
import { hellTiles } from "./tiles";
import { getHellInitialPosition } from "./position";
import { hellNpcs } from "./npcs";
import { getHellDialogue } from "./dialogue";
import { hellEvents } from "./events";
import { sceneBackgrounds } from "@/data/scene/background";

export const hellScene: SceneConfig = {
  id: "hell",
  background: sceneBackgrounds.HallHell,
  scaleFix: 1.4,
  dialogueData: getHellDialogue,
  tiles: hellTiles,
  events: hellEvents,
  initialPosition: getHellInitialPosition,
  map: hallHell,
  audio: { src: MUSICS.default },
  npcs: hellNpcs,
};

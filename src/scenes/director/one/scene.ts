import { blocked } from "@/maps/blocked";
import { MUSICS } from "@/scenes/shared/music";
import { directorNpcs } from "./npcs";
import { directorEvents } from "./events";
import { getDirectorOneInitialPosition } from "./position";

export const oneScene: SceneConfig = {
  id: "one",
  initialPosition: getDirectorOneInitialPosition,
  autoStartDialogue: true,
  map: blocked,
  scaleFix: 1.6,
  events: directorEvents,
  audio: { src: MUSICS.default },
  npcs: directorNpcs,
};

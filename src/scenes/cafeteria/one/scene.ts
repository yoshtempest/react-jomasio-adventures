import { cafeteria } from "@/maps/cafeteria/one";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaOneInitialPosition } from "./position";
import { cafeteriaOneTiles } from "./tiles";
import { getCafeteriaOneDialogue } from "./dialogue";
import { cafeteriaOneNpcs } from "./npcs";
import { cafeteriaOneEvents } from "./events";
import { sceneBackgrounds } from "@/data/scene/background";
import { hasFlag } from "@/scenes/shared/helpers";

export const oneScene: SceneConfig = {
  id: "one",
  background: sceneBackgrounds.Cafeteria,
  scaleFix: 1.7,
  map: cafeteria,
  events: cafeteriaOneEvents,
  npcs: cafeteriaOneNpcs,
  autoStartDialogue: ({ flags }) => hasFlag(flags, "deise"),
  dialogueData: getCafeteriaOneDialogue,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaOneInitialPosition,
  tiles: cafeteriaOneTiles,
};

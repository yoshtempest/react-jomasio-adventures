import { footballCourt } from "@/maps/footballCourt/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getFootballCourtOneInitialPosition } from "./position";
import { getFootballCourtOneDialogue } from "./dialogue";
import { footballCourtOneNpcs } from "./npcs";
import { footballCourtOneEvents } from "./events";
import { footballCourtOneTiles } from "./tiles";

export const oneScene: SceneConfig = {
  id: "one",
  map: footballCourt,
  events: footballCourtOneEvents,
  npcs: footballCourtOneNpcs,
  dialogueData: getFootballCourtOneDialogue,
  audio: { src: MUSICS.default },
  initialPosition: getFootballCourtOneInitialPosition,
  tiles: footballCourtOneTiles,
};

import { footballCourt } from "@/maps/footballCourt/one";
import { MUSICS } from "@/scenes/shared/music";
import { getFootballCourtOneInitialPosition } from "./position";
import { getFootballCourtOneDialogue } from "./dialogue";
import { footballCourtOneNpcs } from "./npcs";
import { footballCourtOneEvents } from "./events";
import { footballCourtOneTiles } from "./tiles";
import { FOOTBALLCOURT_DOG_LOCATION_ID } from "@/hooks/scene/footballCourtDogs/useFootballCourtDogs";

export const oneScene: SceneConfig = {
  id: "one",
  map: footballCourt,
  events: footballCourtOneEvents,
  npcs: footballCourtOneNpcs,
  dialogueData: getFootballCourtOneDialogue,
  audio: { src: MUSICS.default },
  initialPosition: getFootballCourtOneInitialPosition,
  tiles: footballCourtOneTiles,
  tombstoneLocationId: FOOTBALLCOURT_DOG_LOCATION_ID,
};

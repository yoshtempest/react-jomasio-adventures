import { cantina } from "@/maps/cantina/one";
import { MUSICS } from "@/scenes/shared/music";
import { getCantinaOneInitialPosition } from "./position";
import { getCantinaOneDialogue } from "./dialogue";
import { cantinaOneNpcs } from "./npcs";
import { cantinaOneEvents } from "./events";
import { cantinaOneTiles } from "./tiles";
import { cantinaTwoPlates } from "../two/plate";
import { hasFlag, hasQuest } from "@/scenes/shared/helpers";

export const oneScene: SceneConfig = {
  id: "one",
  map: cantina,
  events: cantinaOneEvents,
  scaleFix: 2,
  npcs: cantinaOneNpcs,
  dialogueData: getCantinaOneDialogue,
  autoStartDialogue: ({ quests, flags }) =>
    (hasQuest(quests, "director_escape") && !hasFlag(flags, "jhowsimar")) ||
    hasFlag(flags, "jhowsimar"),
  audio: { src: MUSICS.default },
  initialPosition: getCantinaOneInitialPosition,
  tiles: cantinaOneTiles,
  plates: cantinaTwoPlates,
  tombstoneLocationId: "cantina",
};

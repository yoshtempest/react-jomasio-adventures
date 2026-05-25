import { hallJailsonOne } from "@/maps/hall/jailsonOne";
import { getJailsonOneDialogue } from "./dialogue"
import { HALL_MUSIC } from "@/scenes/shared/music";
import { jailsonOneTiles } from "./tiles";
import { getJailsonOneInitialPosition } from "./position";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { jailsonOneEvents } from "./events";
import { jailsonOneNpcs } from "./npcs";

export const jailsonOneScene: SceneConfig = {
  id: "jailson-one",
  className: "HallJailson",
  map: hallJailsonOne,
  tiles: jailsonOneTiles,
  events: jailsonOneEvents,
  dialogueData: getJailsonOneDialogue,
  initialPosition: getJailsonOneInitialPosition,
  audio: { src: HALL_MUSIC.jailson },
  npcs: jailsonOneNpcs
};
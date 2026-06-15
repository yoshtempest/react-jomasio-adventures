import { hallJailsonOne } from "@/maps/hall/jailsonOne";
import { getJailsonOneDialogue } from "./dialogue";
import { MUSICS } from "@/scenes/shared/music";
import { jailsonOneTiles } from "./tiles";
import { getJailsonOneInitialPosition } from "./position";
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
  audio: { src: MUSICS.jailson },
  npcs: jailsonOneNpcs,
};

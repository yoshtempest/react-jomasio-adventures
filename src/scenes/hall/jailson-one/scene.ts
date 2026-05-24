import { HALL_MUSIC } from "../shared/music";
import { HALL_ROUTES } from "../shared/routes";

import {
  createDoorTile,
  createNpc,
} from "../shared/factories";

export const jailsonOneScene = {
  id: "jailson-one",

  audio: {
    src: HALL_MUSIC.jailson,
  },

  npcs: [
    createNpc(
      "/assets/npcs/jailson/default.svg",
      8,
      3
    ),
  ],

  tiles: [
    createDoorTile(
      8,
      11,
      HALL_ROUTES.ONE
    ),
  ],
};
import { hallTwo } from "@/maps/hall/two";

import { HALL_MUSIC } from "../shared/music";
import { HALL_ROUTES } from "../shared/routes";

import {
  createDoorTile,
  createNpc,
} from "../shared/factories";

import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const jailsonOneScene: SceneConfig = {
  id: "jailson-one",

  map: hallTwo,

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
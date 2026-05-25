import { hallLeft } from "@/maps/hall/left";

import { HALL_MUSIC } from "../../shared/music";
import { HALL_ROUTES } from "../../shared/routes";

import {
  createDoorTile,
  createNpc,
} from "../../shared/factories";

import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getHallLeftDialogue } from "./dialogue"

export const leftOneScene: SceneConfig = {
  id: "left-one",
  dialogueData: getHallLeftDialogue,

  map: hallLeft,

  audio: {
    src: HALL_MUSIC.default,
  },

  npcs: [
    createNpc(
      "/assets/npcs/solange/default.svg",
      2,
      8
    ),
  ],

  tiles: [
    createDoorTile(
        8,
        11,
        HALL_ROUTES.AFTER_PCROOM_ONE
    ),
    createDoorTile(
        9,
        11,
        HALL_ROUTES.AFTER_PCROOM_ONE
    )
  ],
};
import { afterPcRoom } from "@/maps/hall/afterPcRoom";
import { getAfterPcRoomOneDialogue } from "./dialogue"

import { HALL_MUSIC } from "../../shared/music";
import { HALL_ROUTES } from "../../shared/routes";

import {
  createDoorTile,
  createNpc,
} from "../../shared/factories";

import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const afterPcRoomOneScene: SceneConfig = {
  id: "afterpcroom-one",
  dialogueData: getAfterPcRoomOneDialogue,

  map: afterPcRoom,

  audio: {
    src: HALL_MUSIC.jailson,
  },

  npcs: [
    createNpc(
      "/assets/npcs/remedinha/default.svg",
      1,
      9
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
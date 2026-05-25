import { hallJailson } from "@/maps/hall/jailson";
import { getJailsonTwoDialogue } from "./dialogue"

import { HALL_MUSIC } from "../../shared/music";
import { HALL_ROUTES } from "../../shared/routes";

import {
  createDoorTile,
  createNpc,
} from "../../shared/factories";

import type { SceneConfig } from "@/utils/types/maps/sceneConfig";

export const jailsonTwoScene: SceneConfig = {
    id: "jailson-two",
    dialogueData: getJailsonTwoDialogue,

    map: hallJailson,

    audio: {
        src: HALL_MUSIC.jailson,
    },

    npcs: [
        createNpc(
            "/assets/npcs/jailson/default.svg",
            8,
            3
        ),
        createNpc(
            "/assets/npcs/slimita/up.svg",
            8,
            4
        )
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
import { createConditionalTile, createDoorTile } from "@/scenes/shared/factories";
import {
    OTHER_ROUTES,
    HALL_ROUTES,
    CAFETERIA_ROUTES
} from "@/scenes/shared/routes";
import { hasAnyQuest, hasQuest } from "@/scenes/shared/helpers";

export const cantinaTwoTiles = [
    createDoorTile(1, 11, HALL_ROUTES.CENTER_ONE),
    createConditionalTile(
        10,
        2,
        (_player, quests) => {
        if (hasQuest(quests, "director_escape")) {
            return OTHER_ROUTES.DIRECTOR_TWO;
        }
        return null;
        blockedMessage: "Vou colocar que seja necessário apertar L na porta para entrar com a chave ao invés de apertar andar em cima da porta"
        }
    ),
    createConditionalTile(
        6,
        2,
        (_player, quests) => {
        if (hasQuest(quests, "encounter_deise")) {
            return CAFETERIA_ROUTES.FOUR;
        } else if (hasQuest(quests, "encounter_deise")) {
            return CAFETERIA_ROUTES.ONE
        }
        return null;
        blockedMessage: "Vou colocar que seja necessário apertar L na porta para entrar com a chave ao invés de apertar andar em cima da porta"
        }
    ),
    createConditionalTile(
        15,
        11,
        (_player, quests) => {
        if (            
            hasAnyQuest(quests, [
                "encounter_deise",
                "go_cafeteria",
                "search_packaging",
                "letter_delivery"
            ])) {
                return HALL_ROUTES.AFTER_PCROOM_ONE;
            }
        return HALL_ROUTES.ONE;
        }
    ),
];
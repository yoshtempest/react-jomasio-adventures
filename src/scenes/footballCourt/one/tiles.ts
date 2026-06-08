import { createConditionalTile } from "@/scenes/shared/factories";
import {
    OTHER_ROUTES,
    HALL_ROUTES,
    CAFETERIA_ROUTES
} from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const footballCourtOneTiles = [
    createConditionalTile(
        2,
        4,
        (_player, quests) => {
        if (hasQuest(quests, "explore_jorjao")) {
            return HALL_ROUTES.CENTER_ONE;
        }
        return null;
        },
        {
            blockedMessage: "Passagem bloqueada"
        }
    ),
    createConditionalTile(
        10,
        3,
        (_player, quests) => {
        if (hasQuest(quests, "director_escape")) {
            return OTHER_ROUTES.DIRECTOR_TWO;
        }
        return null;
        },
        {
            blockedMessage: "Porta trancada"
        }
    ),
    createConditionalTile(
        6,
        3,
        (_player, quests) => {
        if (hasQuest(quests, "denis_sausage")) {
            return CAFETERIA_ROUTES.FOUR;
        } else if (hasQuest(quests, "go_cafeteria")) {
            return CAFETERIA_ROUTES.ONE
        }
        return null;
        },
        {
            blockedMessage: "Porta trancada"
        }
    ),
];
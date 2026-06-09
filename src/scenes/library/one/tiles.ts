import { createConditionalTile } from "@/scenes/shared/factories";
import { HALL_ROUTES } from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";

export const libraryOneTiles = [
    createConditionalTile(
        2,
        4,
        (_player, quests) => {
        if (hasQuest(quests, "explore_jorjao")) {
            return HALL_ROUTES.THIRD_CLASS;
        }
        return null;
        },
        {
            blockedMessage: "Passagem bloqueada"
        }
    ),
];
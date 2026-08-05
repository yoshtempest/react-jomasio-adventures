

import { createConditionalTile } from "@/scenes/shared/factories";
import { HALL_ROUTES } from "@/scenes/shared/routes";
import { hasQuest } from "@/scenes/shared/helpers";
  
export const hellRoomTwoTiles = [
    createConditionalTile(
        10,
        6,
        (_player, quests) => {
        if (hasQuest(quests, "x1_maugrelo")) {
            return HALL_ROUTES.HELL;
        }
        return null;
        },
        {
        blockedMessage: "Porta trancada",
        },
    ),
];
  
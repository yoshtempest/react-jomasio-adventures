import { createDoorTile } from "@/scenes/shared/factories";
import {
    HALL_ROUTES,
    OTHER_ROUTES,
    PCROOM_ROUTES
} from "@/scenes/shared/routes";

export const hallOneTiles = [
    createDoorTile(
        8,
        2,
        HALL_ROUTES.JAILSON_ONE
    ),
    createDoorTile(
        2,
        8,
        HALL_ROUTES.LEFT_ONE
    ),
    createDoorTile(
        12,
        7,
        PCROOM_ROUTES.ONE
    ),
    createDoorTile(
        8,
        11,
        OTHER_ROUTES.CANTINA_TWO
    )
];
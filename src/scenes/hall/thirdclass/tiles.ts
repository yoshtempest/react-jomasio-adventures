import { createDoorTile } from "@/scenes/shared/factories";
import {
    HALL_ROUTES,
    OTHER_ROUTES,
} from "@/scenes/shared/routes";

export const hallThirdClassTiles = [
    createDoorTile(3, 7, OTHER_ROUTES.BRODI_CLASS),
    createDoorTile(8, 3, OTHER_ROUTES.LIBRARY),
    createDoorTile(8, 11, HALL_ROUTES.CENTER_FRONT),
];
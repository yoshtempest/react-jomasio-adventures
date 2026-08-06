import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES } from "@/scenes/shared/routes";

export const pandemonyTiles = [
    createDoorTile(8, 12, HALL_ROUTES.HELL),
    createDoorTile(9, 12, HALL_ROUTES.HELL),
    createDoorTile(10, 12, HALL_ROUTES.HELL),
];

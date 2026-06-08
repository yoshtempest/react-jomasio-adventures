import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES } from "@/scenes/shared/routes";
      
export const hallCenterFrontTiles = [
    createDoorTile(12, 5, HALL_ROUTES.THIRD_CLASS),
    createDoorTile(8, 11, HALL_ROUTES.CENTER_ONE),
];
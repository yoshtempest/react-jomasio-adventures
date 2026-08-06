import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES } from "@/scenes/shared/routes";

export const hallCenterFrontTiles = [
  createDoorTile(14, 4, HALL_ROUTES.THIRD_CLASS),
  createDoorTile(8, 12, HALL_ROUTES.CENTER_ONE),
  createDoorTile(9, 12, HALL_ROUTES.CENTER_ONE),
  createDoorTile(10, 12, HALL_ROUTES.CENTER_ONE),
];

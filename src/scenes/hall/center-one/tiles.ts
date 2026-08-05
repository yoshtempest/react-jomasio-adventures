import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES, CANTINA_ROUTES } from "@/scenes/shared/routes";

export const centerOneTiles = [
  createDoorTile(13, 7, HALL_ROUTES.HELL),
  createDoorTile(3, 6, CANTINA_ROUTES.TWO),
  createDoorTile(10, 0, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(8, 12, HALL_ROUTES.LEFT_ONE),
  createDoorTile(9, 12, HALL_ROUTES.LEFT_ONE),
];

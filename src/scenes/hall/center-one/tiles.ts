import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES, CANTINA_ROUTES } from "@/scenes/shared/routes";

export const centerOneTiles = [
  createDoorTile(16, 6, HALL_ROUTES.HELL),
  createDoorTile(3, 6, CANTINA_ROUTES.TWO),
  createDoorTile(9, 1, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(8, 12, HALL_ROUTES.LEFT_ONE),
  createDoorTile(9, 12, HALL_ROUTES.LEFT_ONE),
];

import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES, CANTINA_ROUTES } from "@/scenes/shared/routes";

export const centerTwoTiles = [
  createDoorTile(13, 7, HALL_ROUTES.HELL),
  createDoorTile(3, 6, CANTINA_ROUTES.TWO),
  createDoorTile(8, 3, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(8, 11, HALL_ROUTES.LEFT_ONE),
];

import { createDoorTile } from "@/scenes/shared/factories";
import {
  HALL_ROUTES,
  OTHER_ROUTES
} from "@/scenes/shared/routes";

export const centerOneTiles = [
  createDoorTile(13, 7, HALL_ROUTES.HELL),
  createDoorTile(3, 6, OTHER_ROUTES.CANTINA_TWO),
  createDoorTile(8, 3, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(8, 11, HALL_ROUTES.LEFT_ONE),
];
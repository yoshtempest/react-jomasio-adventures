import { createDoorTile } from "@/scenes/shared/factories";
import {
  HALL_ROUTES,
  OTHER_ROUTES
} from "@/scenes/shared/routes";

export const centerTwoTiles = [
  createDoorTile(14, 7, HALL_ROUTES.HELL),
  createDoorTile(3, 7, OTHER_ROUTES.CANTINA_TWO),
  createDoorTile(8, 5, HALL_ROUTES.CENTER_FRONT),
  createDoorTile(7, 11, HALL_ROUTES.LEFT_ONE),
];
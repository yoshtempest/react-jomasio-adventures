import { createDoorTile } from "@/scenes/shared/factories";
import {
  HALL_ROUTES,
  LIBRARY_ROUTES,
  BRODICLASS_ROUTES,
} from "@/scenes/shared/routes";

export const hallThirdClassTiles = [
  createDoorTile(3, 7, BRODICLASS_ROUTES.ONE),
  createDoorTile(8, 3, LIBRARY_ROUTES.ONE),
  createDoorTile(8, 11, HALL_ROUTES.CENTER_FRONT),
];

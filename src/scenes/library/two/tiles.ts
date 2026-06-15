import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES, LIBRARY_ROUTES } from "@/scenes/shared/routes";

export const cantinaTwoTiles = [
  createDoorTile(4, 3, HALL_ROUTES.THIRD_CLASS),
  createDoorTile(12, 3, LIBRARY_ROUTES.THREE),
];

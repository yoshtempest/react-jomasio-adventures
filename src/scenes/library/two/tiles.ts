import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES, LIBRARY_ROUTES } from "@/scenes/shared/routes";

export const cantinaTwoTiles = [
  createDoorTile(4, 2, HALL_ROUTES.THIRD_CLASS),
  createDoorTile(14, 2, LIBRARY_ROUTES.THREE),
];

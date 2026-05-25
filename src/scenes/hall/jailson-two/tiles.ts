import { createDoorTile } from "@/scenes/shared/factories";
import { HALL_ROUTES } from "@/scenes/shared/routes";

export const jailsonTwoTiles = [
  createDoorTile(9, 11, HALL_ROUTES.AFTER_PCROOM_ONE),
  createDoorTile(8, 11, HALL_ROUTES.AFTER_PCROOM_ONE),
];
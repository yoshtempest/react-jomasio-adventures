import { createDoorTile } from "@/scenes/shared/factories";
import { FOOTBALLCOURT_ROUTES, LIBRARY_ROUTES } from "@/scenes/shared/routes";

export const librarySecretPassageTiles = [
    createDoorTile(8, 2, FOOTBALLCOURT_ROUTES.ONE),
    createDoorTile(8, 11, LIBRARY_ROUTES.TWO)
];
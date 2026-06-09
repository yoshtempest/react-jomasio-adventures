import { createDoorTile } from "@/scenes/shared/factories";
import { OTHER_ROUTES } from "@/scenes/shared/routes";

export const librarySecretPassageTiles = [
    createDoorTile(8, 2, OTHER_ROUTES.FOOTBALLCOURT_ONE),
    createDoorTile(8, 11, OTHER_ROUTES.LIBRARY_TWO)
];
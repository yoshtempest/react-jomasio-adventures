import { playerPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cantinaOneNpcs = [
  createNpc(playerPath("/marcelo/movement/up.svg"), 14, 8, 1.4),
  createNpc(playerPath("/eduarda/movement/down.svg"), 14, 6, 1.4),
  createNpc(playerPath("/larissa/movement/down.svg"), 15, 6, 1.4),
];

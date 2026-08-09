import { playerPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cantinaTwoNpcs = [
  createNpc(playerPath("/samuel/movement/right.svg"), 6, 6),
  createNpc(playerPath("/marcelo/movement/up.svg"), 8, 8),
  createNpc(playerPath("/emanuel/default.svg"), 14, 4),
  createNpc(playerPath("/artur/movement/down.svg"), 7, 4),
  createNpc(playerPath("/larissa/movement/up.svg"), 15, 10),
  createNpc(playerPath("/eduarda/movement/up.svg"), 14, 10),
  createNpc(playerPath("/mayra/default.svg"), 13, 9),
  createNpc(playerPath("/camilly/default.svg"), 14, 8),
];

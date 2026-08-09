import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cantinaTwoNpcs = [
  createNpc(npcPath("/jeso/default.svg"), 11, 3),
  createNpc(npcPath("/brothers/default.svg"), 17, 3),
];

import { playerPath, npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const footballCourtOneNpcs = [
  createNpc(npcPath("/neimito/right.svg"), 9, 4),
  createNpc(playerPath("/emanuel/movement/left.svg"), 10, 4),
];

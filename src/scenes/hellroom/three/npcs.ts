import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const hellroomThreeNpcs = [
  createNpc(npcPath("/reincardion/right.svg"), 10, 5),
  createNpc(npcPath("/maugrelo/right.svg"), 9, 6),
  createNpc(npcPath("/kidBengala/right.svg"), 9, 7),
];

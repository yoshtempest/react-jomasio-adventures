import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cafeteriaTwoNpcs = [
  createNpc(npcPath("/denis/default.svg"), 12, 5),
  createNpc(npcPath("/deise/default.svg"), 14, 5),
];

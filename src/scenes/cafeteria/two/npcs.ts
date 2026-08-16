import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cafeteriaTwoNpcs = [
  createNpc(npcPath("/denis/default.svg"), 16, 4.6),
  createNpc(npcPath("/deise/default.svg"), 18, 4.6),
];

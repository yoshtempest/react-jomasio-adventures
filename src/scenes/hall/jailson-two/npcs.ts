import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const jailsonTwoNpcs = [
  createNpc(npcPath("/jailson/default.svg"), 9, 1),
  createNpc(npcPath("/slimita/up.svg"), 9, 2),
];

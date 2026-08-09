import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const centerTwoNpcs = [
  createNpc(npcPath("/planetarySisters/mary.svg"), 8.5, 1),
  createNpc(npcPath("/planetarySisters/nelit.svg"), 10, 1),
];

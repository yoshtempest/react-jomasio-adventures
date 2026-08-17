import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cantinaOneNpcs = [
  createNpc(
    (ctx) => {
      const hasDirectorEscape = ctx.quests.some(q => q.id === "director_escape");
      const hasX1Jhowsimar = ctx.quests.some(q => q.id === "x1_jhowsimar");

      if (hasDirectorEscape && !hasX1Jhowsimar) return npcPath("/jhowsimar/sleeping.svg");
      if (hasDirectorEscape && hasX1Jhowsimar) return npcPath("/jhowsimar/right.svg");
      return npcPath("/jhowsimar/default.svg");
    },
    11,
    3
  ),
  createNpc(npcPath("/brothers/default.svg"), 19, 3),
];

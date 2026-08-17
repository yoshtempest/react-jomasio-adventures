import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cantinaOneNpcs = [
  createNpc(
    (ctx) => {
      const hasDirectorEscape = ctx.quests.some(q => q.id === "director_escape");
      const hasX1Jhowsimar = ctx.quests.some(q => q.id === "x1_jhowsimar");

      if (ctx.dialogueIndex !== undefined && hasDirectorEscape && !hasX1Jhowsimar) {
        if (ctx.dialogueIndex <= 1) return npcPath("/jhowsimar/sleeping.svg");
        if (ctx.dialogueIndex === 2) return npcPath("/jhowsimar/wakingUp.svg");
        return npcPath("/jhowsimar/right.svg");
      }
      return npcPath("/jhowsimar/default.svg");
    },
    11,
    3
  ),
  createNpc(npcPath("/brothers/default.svg"), 19, 3),
];

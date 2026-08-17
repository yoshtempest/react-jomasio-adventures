import { npcPath } from "@/utils/paths";

import { createNpc } from "@/scenes/shared/factories";

export const cantinaOneNpcs = [
  createNpc(
    (ctx) => ctx.quests.some(q => q.id === "director_escape" && q.completed)
      ? npcPath("/jhowsimar/sleeping.svg")
      : npcPath("/jhowsimar/default.svg"),
    11,
    3
  ),
  createNpc(npcPath("/brothers/default.svg"), 19, 3),
];

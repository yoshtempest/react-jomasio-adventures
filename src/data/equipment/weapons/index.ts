import type { EquipmentDef } from "@/utils/types/player/equipment";

import { BLADES } from "./blades";
import { BOOKS } from "./books";
import { BOWS } from "./bows";
import { TOOL_WEAPONS } from "./professions";
import { STAFFS } from "./staffs";

export const WEAPONS = [
  ...BLADES,
  ...BOOKS,
  ...BOWS,
  ...STAFFS,
  ...TOOL_WEAPONS,
] as const satisfies readonly EquipmentDef[];
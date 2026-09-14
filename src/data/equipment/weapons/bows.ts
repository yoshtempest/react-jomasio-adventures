import type { EquipmentDef } from "@/utils/types/player/equipment";

export const BOWS = [
  {
    id: "weapon_arco_preciso",
    name: "Arco Preciso",
    slot: "weapon",
    rank: 3,
    stats: { strength: 2, intelligence: 1 },
  },
] as const satisfies readonly EquipmentDef[];

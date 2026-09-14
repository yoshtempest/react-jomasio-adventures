import type { EquipmentDef } from "@/utils/types/player/equipment";

export const BOOKS = [
  {
    id: "weapon_livro_mestre",
    name: "Livro do Mestre",
    slot: "weapon",
    rank: 1,
    stats: { intelligence: 2 },
  },
] as const satisfies readonly EquipmentDef[];

import { createEquipmentList } from "@/utils/equipment/createEquipmentList";

export const BOOKS = createEquipmentList("weapon", [
  {
    id: "weapon_livro_mestre",
    name: "Livro do Mestre",
    rank: 1,
    stats: { spirit: 2 },
  },
]);

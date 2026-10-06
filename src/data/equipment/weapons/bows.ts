import { createEquipmentList } from "@/utils/equipment/createEquipmentList";

export const BOWS = createEquipmentList("weapon", [
  {
    id: "weapon_arco_preciso",
    name: "Arco Preciso",
    rank: 3,
    stats: { strength: 2, technique: 1 },
  },
  {
    id: "weapon_artemis",
    name: "Artemis",
    rank: 3,
    stats: { strength: 2, technique: 1 },
  },
]);

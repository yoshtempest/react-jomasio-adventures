import { createEquipmentList } from "@/utils/equipment/createEquipmentList";

export const CHESTPLATES = createEquipmentList("chestplate", [
  {
    id: "chestplate_regata_baiano",
    name: "Regata do Baiano",
    rank: 1,
    stats: { hp: 1, armor: 3 },
  },
  {
    id: "chestplate_colete_couro",
    name: "Colete de Couro",
    rank: 1,
    stats: { armor: 4 },
  },
  {
    id: "chestplate_armadura_aco",
    name: "Armadura de Aço",
    rank: 3,
    stats: { hp: 1, armor: 7 },
  },
  {
    id: "chestplate_peitoral_reforcado",
    name: "Peitoral Reforçado",
    rank: 5,
    stats: { hp: 2, armor: 14 },
    set: "reforcado",
  },
  {
    id: "chestplate_camisa_insider",
    name: "Camisa da Insider",
    rank: 7,
    stats: { hp: 3, armor: 22, reflect: 2 },
  },
  {
    id: "chestplate_armadura_lendaria",
    name: "Armadura Lendária",
    rank: 9,
    stats: { hp: 4, armor: 35, reflect: 3 },
    set: "lendario",
  },
]);

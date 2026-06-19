import type { Equipment } from "@/utils/types/player/equipment";

export const CHESTPLATES: Equipment[] = [
  {
    id: "chestplate_regata_baiano",
    name: "Regata do Baiano",
    slot: "chestplate",
    rank: 1,
    stats: { hp: 1, armor: 3 },
  },
  {
    id: "chestplate_colete_couro",
    name: "Colete de Couro",
    slot: "chestplate",
    rank: 1,
    stats: { armor: 4 },
  },
  {
    id: "chestplate_armadura_aco",
    name: "Armadura de Aço",
    slot: "chestplate",
    rank: 3,
    stats: { hp: 1, armor: 7 },
  },
  {
    id: "chestplate_peitoral_reforcado",
    name: "Peitoral Reforçado",
    slot: "chestplate",
    rank: 5,
    stats: { hp: 2, armor: 14 },
    set: "reforcado",
  },
  {
    id: "chestplate_camisa_insider",
    name: "Camisa da Insider",
    slot: "chestplate",
    rank: 7,
    stats: { hp: 3, armor: 22, reflect: 2 },
  },
  {
    id: "chestplate_armadura_lendaria",
    name: "Armadura Lendária",
    slot: "chestplate",
    rank: 9,
    stats: { hp: 4, armor: 35, reflect: 3 },
    set: "lendario",
  },
];

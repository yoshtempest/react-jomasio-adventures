import type { Equipment } from "@/utils/types/player/equipment";

export const CHESTPLATES: Equipment[] = [
  {
    id: "chestplate_regata_baiano",
    name: "Regata do Baiano",
    slot: "chestplate",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 3, shield: 0, vampirism: 0, reflect: 0 },
  },
  {
    id: "chestplate_colete_couro",
    name: "Colete de Couro",
    slot: "chestplate",
    rank: "common",
    stats: { hp: 0, strength: 0, intelligence: 1, armor: 4, shield: 0, vampirism: 0, reflect: 0 },
  },
  {
    id: "chestplate_armadura_aco",
    name: "Armadura de Aço",
    slot: "chestplate",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 7, shield: 0, vampirism: 0, reflect: 0 },
  },
  {
    id: "chestplate_peitoral_reforcado",
    name: "Peitoral Reforçado",
    slot: "chestplate",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 14, shield: 0, vampirism: 0, reflect: 0 },
  },
  {
    id: "chestplate_camisa_insider",
    name: "Camisa da Insider",
    slot: "chestplate",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 22, shield: 0, vampirism: 0, reflect: 2 },
  },
  {
    id: "chestplate_armadura_lendaria",
    name: "Armadura Lendária",
    slot: "chestplate",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 35, shield: 0, vampirism: 0, reflect: 3 },
  },
];

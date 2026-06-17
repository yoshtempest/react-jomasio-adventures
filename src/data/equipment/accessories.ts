import type { Equipment } from "@/utils/types/player/equipment";

export const ACCESSORIES: Equipment[] = [
  {
    id: "accessory_anel_latao",
    name: "Anel de Latão",
    slot: "accessory",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 1, shield: 0 },
  },
  {
    id: "accessory_colar_osso",
    name: "Colar de Osso",
    slot: "accessory",
    rank: "common",
    stats: { hp: 2, strength: 0, intelligence: 0, armor: 0, shield: 0 },
  },
  {
    id: "accessory_anel_prata",
    name: "Anel de Prata",
    slot: "accessory",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 3, shield: 3 },
  },
  {
    id: "accessory_anel_ouro",
    name: "Anel de Ouro",
    slot: "accessory",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 6, shield: 6 },
  },
  {
    id: "accessory_anel_rei",
    name: "Anel do Rei",
    slot: "accessory",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 10, shield: 12 },
  },
  {
    id: "accessory_anel_lendario",
    name: "Anel Lendário",
    slot: "accessory",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 16, shield: 20 },
  },
];

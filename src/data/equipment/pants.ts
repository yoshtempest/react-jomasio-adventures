import type { Equipment } from "@/utils/types/player/equipment";

export const PANTS: Equipment[] = [
  {
    id: "pants_calcas_remendadas",
    name: "Calças Remendadas",
    slot: "pants",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 2, shield: 0 },
  },
  {
    id: "pants_grevas_ferro",
    name: "Grevas de Ferro",
    slot: "pants",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 4, shield: 0 },
  },
  {
    id: "pants_calcas_reforcadas",
    name: "Calças Reforçadas",
    slot: "pants",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 8, shield: 0 },
  },
  {
    id: "pants_calca_rei",
    name: "Calça do Rei",
    slot: "pants",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 14, shield: 0 },
  },
  {
    id: "pants_calcas_lendarias",
    name: "Calças Lendárias",
    slot: "pants",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 22, shield: 0 },
  },
];

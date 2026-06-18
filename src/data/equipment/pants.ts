import type { Equipment } from "@/utils/types/player/equipment";

export const PANTS: Equipment[] = [
  {
    id: "pants_calcas_remendadas",
    name: "Calças Remendadas",
    slot: "pants",
    rank: "common",
    stats: { hp: 1, armor: 2 },
  },
  {
    id: "pants_grevas_ferro",
    name: "Grevas de Ferro",
    slot: "pants",
    rank: "rare",
    stats: { hp: 1, armor: 4 },
  },
  {
    id: "pants_calcas_reforcadas",
    name: "Calças Reforçadas",
    slot: "pants",
    rank: "epic",
    stats: { hp: 2, armor: 8 },
  },
  {
    id: "pants_calca_rei",
    name: "Calça do Rei",
    slot: "pants",
    rank: "boss",
    stats: { hp: 3, armor: 14, reflect: 2 },
  },
  {
    id: "pants_calcas_lendarias",
    name: "Calças Lendárias",
    slot: "pants",
    rank: "legendary",
    stats: { hp: 4, armor: 22, reflect: 3 },
  },
];

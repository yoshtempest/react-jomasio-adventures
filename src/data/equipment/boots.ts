import type { Equipment } from "@/utils/types/player/equipment";

export const BOOTS: Equipment[] = [
  {
    id: "boots_chinelos_babidi",
    name: "Chinelos de Babidi",
    slot: "boots",
    rank: "common",
    stats: { hp: 1, strength: 1, armor: 1 },
  },
  {
    id: "boots_sandalias_humildade",
    name: "Sandálias da Humildade",
    slot: "boots",
    rank: "common",
    stats: { intelligence: 1, armor: 1 },
  },
  {
    id: "boots_botas_couro",
    name: "Botas de Couro",
    slot: "boots",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 3 },
  },
  {
    id: "boots_botas_epicas",
    name: "Botas Épicas",
    slot: "boots",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 6 },
  },
  {
    id: "boots_grevas_rei",
    name: "Grevas do Rei",
    slot: "boots",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 10, reflect: 2 },
  },
  {
    id: "boots_botas_lendarias",
    name: "Botas Lendárias",
    slot: "boots",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 16, reflect: 3 },
  },
];

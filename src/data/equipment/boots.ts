import type { Equipment } from "@/utils/types/player/equipment";

export const BOOTS: Equipment[] = [
  {
    id: "boots_chinelos_babidi",
    name: "Chinelos de Babidi",
    slot: "boots",
    rank: 1,
    stats: { hp: 1, armor: 1 },
  },
  {
    id: "boots_sandalias_humildade",
    name: "Sandálias da Humildade",
    slot: "boots",
    rank: 1,
    stats: { armor: 1 },
  },
  {
    id: "boots_botas_couro",
    name: "Botas de Couro",
    slot: "boots",
    rank: 3,
    stats: { hp: 1, armor: 3 },
  },
  {
    id: "boots_botas_epicas",
    name: "Botas Épicas",
    slot: "boots",
    rank: 5,
    stats: { hp: 2, armor: 6 },
  },
  {
    id: "boots_grevas_rei",
    name: "Grevas do Rei",
    slot: "boots",
    rank: 7,
    stats: { hp: 3, armor: 10, reflect: 2 },
    set: "rei",
  },
  {
    id: "boots_botas_lendarias",
    name: "Botas Lendárias",
    slot: "boots",
    rank: 9,
    stats: { hp: 4, armor: 16, reflect: 3 },
    set: "lendario",
  },
];

import type { Equipment } from "@/utils/types/player/equipment";

export const BAGS: Equipment[] = [
  {
    id: "bag_bolsa_pano",
    name: "Bolsa de Pano",
    slot: "bag",
    rank: 1,
    stats: {},
    bonusSlots: 20,
  },
  {
    id: "bag_mochila_couro",
    name: "Mochila de Couro",
    slot: "bag",
    rank: 3,
    stats: {},
    bonusSlots: 40,
  },
  {
    id: "bag_mochila_reforcada",
    name: "Mochila Reforçada",
    slot: "bag",
    rank: 5,
    stats: {},
    bonusSlots: 70,
  },
  {
    id: "bag_mochila_rei",
    name: "Mochila do Rei",
    slot: "bag",
    rank: 7,
    stats: {},
    bonusSlots: 100,
  },
  {
    id: "bag_distorce_espaco",
    name: "Distorce Espaço-Tempo",
    slot: "bag",
    rank: 9,
    stats: {},
    bonusSlots: Infinity,
  },
];

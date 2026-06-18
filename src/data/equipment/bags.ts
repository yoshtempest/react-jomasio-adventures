import type { Equipment } from "@/utils/types/player/equipment";

export const BAGS: Equipment[] = [
  {
    id: "bag_bolsa_pano",
    name: "Bolsa de Pano",
    slot: "bag",
    rank: "common",
    stats: {},
    bonusSlots: 20,
  },
  {
    id: "bag_mochila_couro",
    name: "Mochila de Couro",
    slot: "bag",
    rank: "rare",
    stats: {},
    bonusSlots: 40,
  },
  {
    id: "bag_mochila_reforcada",
    name: "Mochila Reforçada",
    slot: "bag",
    rank: "epic",
    stats: {},
    bonusSlots: 70,
  },
  {
    id: "bag_mochila_rei",
    name: "Mochila do Rei",
    slot: "bag",
    rank: "boss",
    stats: {},
    bonusSlots: 100,
  },
  {
    id: "bag_distorce_espaco",
    name: "Distorce Espaço-Tempo",
    slot: "bag",
    rank: "legendary",
    stats: {},
    bonusSlots: Infinity,
  },
];

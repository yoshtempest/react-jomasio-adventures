import type { Equipment } from "@/utils/types/player/equipment";

export const BAGS: Equipment[] = [
  {
    id: "bag_bolsa_pano",
    name: "Bolsa de Pano",
    slot: "bag",
    rank: "common",
    stats: { hp: 1, strength: 1 },
    bonusSlots: 20,
  },
  {
    id: "bag_mochila_couro",
    name: "Mochila de Couro",
    slot: "bag",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1 },
    bonusSlots: 40,
  },
  {
    id: "bag_mochila_reforcada",
    name: "Mochila Reforçada",
    slot: "bag",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1 },
    bonusSlots: 70,
  },
  {
    id: "bag_mochila_rei",
    name: "Mochila do Rei",
    slot: "bag",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2 },
    bonusSlots: 100,
  },
  {
    id: "bag_distorce_espaco",
    name: "Distorce Espaço-Tempo",
    slot: "bag",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4 },
    bonusSlots: Infinity,
  },
];

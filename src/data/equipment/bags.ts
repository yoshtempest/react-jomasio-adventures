import { createEquipmentList } from "@/utils/equipment/createEquipmentList";

export const BAGS = createEquipmentList("bag", [
  {
    id: "bag_bolsa_pano",
    name: "Bolsa de Pano",
    rank: 1,
    stats: {},
    bonusSlots: 20,
  },
  {
    id: "bag_mochila_couro",
    name: "Mochila de Couro",
    rank: 3,
    stats: {},
    bonusSlots: 40,
  },
  {
    id: "bag_mochila_reforcada",
    name: "Mochila Reforçada",
    rank: 5,
    stats: {},
    bonusSlots: 70,
  },
  {
    id: "bag_mochila_rei",
    name: "Mochila do Rei",
    rank: 7,
    stats: {},
    bonusSlots: 100,
  },
  {
    id: "bag_distorce_espaco",
    name: "Distorce Espaço-Tempo",
    rank: 9,
    stats: {},
    bonusSlots: Infinity,
  },
]);

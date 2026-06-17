import type { Equipment } from "@/utils/types/player/equipment";

export const HELMETS: Equipment[] = [
  {
    id: "helmet_chapeu_cendeiro",
    name: "Chapéu de Cendeiro",
    slot: "helmet",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 2, shield: 0 },
  },
  {
    id: "helmet_touca_algodao",
    name: "Touca de Algodão",
    slot: "helmet",
    rank: "common",
    stats: { hp: 2, strength: 0, intelligence: 0, armor: 1, shield: 0 },
  },
  {
    id: "helmet_faixa_cabeca",
    name: "Faixa de Cabeça",
    slot: "helmet",
    rank: "common",
    stats: { hp: 0, strength: 0, intelligence: 1, armor: 1, shield: 0 },
  },
  {
    id: "helmet_yvel_glasses",
    name: "Yvel glasses",
    slot: "helmet",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 4, shield: 0 },
  },
  {
    id: "helmet_capacete_ferro",
    name: "Capacete de Ferro",
    slot: "helmet",
    rank: "rare",
    stats: { hp: 0, strength: 2, intelligence: 0, armor: 5, shield: 0 },
  },
  {
    id: "helmet_coroa_arcana",
    name: "Coroa Arcana",
    slot: "helmet",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 8, shield: 0 },
  },
  {
    id: "helmet_elmo_reforcado",
    name: "Elmo Reforçado",
    slot: "helmet",
    rank: "epic",
    stats: { hp: 0, strength: 2, intelligence: 0, armor: 10, shield: 0 },
  },
  {
    id: "helmet_coroa_rei",
    name: "Coroa do Rei",
    slot: "helmet",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 14, shield: 0 },
  },
  {
    id: "helmet_tapa_olho_surica",
    name: "Tapa olho de Surica",
    slot: "helmet",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 22, shield: 0 },
  },
];

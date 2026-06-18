import type { Equipment } from "@/utils/types/player/equipment";

export const HELMETS: Equipment[] = [
  {
    id: "helmet_chapeu_cendeiro",
    name: "Chapéu de Cendeiro",
    slot: "helmet",
    rank: "common",
    stats: { hp: 1, strength: 1, armor: 2 },
  },
  {
    id: "helmet_touca_algodao",
    name: "Touca de Algodão",
    slot: "helmet",
    rank: "common",
    stats: { hp: 2, armor: 1 },
  },
  {
    id: "helmet_faixa_cabeca",
    name: "Faixa de Cabeça",
    slot: "helmet",
    rank: "common",
    stats: { intelligence: 1, armor: 1 },
  },
  {
    id: "helmet_yvel_glasses",
    name: "Yvel glasses",
    slot: "helmet",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 4 },
  },
  {
    id: "helmet_capacete_ferro",
    name: "Capacete de Ferro",
    slot: "helmet",
    rank: "rare",
    stats: { armor: 5 },
  },
  {
    id: "helmet_coroa_arcana",
    name: "Coroa Arcana",
    slot: "helmet",
    rank: "epic",
    stats: { hp: 2, armor: 8 },
  },
  {
    id: "helmet_elmo_reforcado",
    name: "Elmo Reforçado",
    slot: "helmet",
    rank: "epic",
    stats: { armor: 10 },
  },
  {
    id: "helmet_coroa_rei",
    name: "Coroa do Rei",
    slot: "helmet",
    rank: "boss",
    stats: { hp: 3, armor: 14, reflect: 2 },
  },
  {
    id: "helmet_tapa_olho_surica",
    name: "Tapa olho de Surica",
    slot: "helmet",
    rank: "legendary",
    stats: { hp: 4, armor: 22, reflect: 3 },
  },
];

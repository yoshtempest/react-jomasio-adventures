import { createEquipmentList } from "@/utils/equipment/createEquipmentList";

export const HELMETS = createEquipmentList("helmet", [
  {
    id: "helmet_chapeu_cendeiro",
    name: "Chapéu de Cendeiro",
    rank: 1,
    stats: { hp: 1, strength: 1, armor: 2 },
  },
  {
    id: "helmet_touca_algodao",
    name: "Touca de Algodão",
    rank: 1,
    stats: { hp: 2, armor: 1 },
  },
  {
    id: "helmet_faixa_cabeca",
    name: "Faixa de Cabeça",
    rank: 1,
    stats: { technique: 1, armor: 1 },
  },
  {
    id: "helmet_yvel_glasses",
    name: "Yvel glasses",
    rank: 3,
    stats: { hp: 1, strength: 1, technique: 1, armor: 4 },
  },
  {
    id: "helmet_capacete_ferro",
    name: "Capacete de Ferro",
    rank: 3,
    stats: { armor: 5 },
  },
  {
    id: "helmet_coroa_arcana",
    name: "Coroa Arcana",
    rank: 5,
    stats: { hp: 2, armor: 8 },
  },
  {
    id: "helmet_elmo_reforcado",
    name: "Elmo Reforçado",
    rank: 5,
    stats: { armor: 10 },
    set: "reforcado",
  },
  {
    id: "helmet_coroa_rei",
    name: "Coroa do Rei",
    rank: 7,
    stats: { hp: 3, armor: 14, reflect: 2 },
    set: "rei",
  },
  {
    id: "helmet_tapa_olho_surica",
    name: "Tapa olho de Surica",
    rank: 9,
    stats: { hp: 4, armor: 22, reflect: 3 },
  },
]);

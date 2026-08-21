import type { EquipmentDef } from "@/utils/types/player/equipment";

export const PANTS = [
  {
    id: "pants_calcas_remendadas",
    name: "Calças Remendadas",
    slot: "pants",
    rank: 1,
    stats: { hp: 1, armor: 2 },
  },
  {
    id: "pants_grevas_ferro",
    name: "Grevas de Ferro",
    slot: "pants",
    rank: 3,
    stats: { hp: 1, armor: 4 },
  },
  {
    id: "pants_calcas_reforcadas",
    name: "Calças Reforçadas",
    slot: "pants",
    rank: 5,
    stats: { hp: 2, armor: 8 },
    set: "reforcado",
  },
  {
    id: "pants_calca_rei",
    name: "Calça do Rei",
    slot: "pants",
    rank: 7,
    stats: { hp: 3, armor: 14, reflect: 2 },
    set: "rei",
  },
  {
    id: "pants_calcas_lendarias",
    name: "Calças Lendárias",
    slot: "pants",
    rank: 9,
    stats: { hp: 4, armor: 22, reflect: 3 },
    set: "lendario",
  },
] as const satisfies readonly EquipmentDef[];

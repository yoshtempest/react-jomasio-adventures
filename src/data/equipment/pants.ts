import { createEquipmentList } from "@/utils/equipment/createEquipmentList";

export const PANTS = createEquipmentList("pants", [
  {
    id: "pants_calcas_remendadas",
    name: "Calças Remendadas",
    rank: 1,
    stats: { hp: 1, armor: 2 },
  },
  {
    id: "pants_grevas_ferro",
    name: "Grevas de Ferro",
    rank: 3,
    stats: { hp: 1, armor: 4 },
  },
  {
    id: "pants_calcas_reforcadas",
    name: "Calças Reforçadas",
    rank: 5,
    stats: { hp: 2, armor: 8 },
    set: "reforcado",
  },
  {
    id: "pants_calca_rei",
    name: "Calça do Rei",
    rank: 7,
    stats: { hp: 3, armor: 14, reflect: 2 },
    set: "rei",
  },
  {
    id: "pants_calcas_lendarias",
    name: "Calças Lendárias",
    rank: 9,
    stats: { hp: 4, armor: 22, reflect: 3 },
    set: "lendario",
  },
]);

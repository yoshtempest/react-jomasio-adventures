import type { EquipmentDef } from "@/utils/types/player/equipment";

export const ACCESSORIES = [
  {
    id: "accessory_anel_latao",
    name: "Anel de Latão",
    slot: "accessory",
    rank: 1,
    stats: { hp: 1, strength: 1, armor: 1 },
  },
  {
    id: "accessory_colar_osso",
    name: "Colar de Osso",
    slot: "accessory",
    rank: 1,
    stats: { hp: 2 },
  },
  {
    id: "accessory_anel_prata",
    name: "Anel de Prata",
    slot: "accessory",
    rank: 3,
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 3, shield: 3 },
  },
  {
    id: "accessory_anel_ouro",
    name: "Anel de Ouro",
    slot: "accessory",
    rank: 5,
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 6, shield: 6 },
  },
  {
    id: "accessory_anel_rei",
    name: "Anel do Rei",
    slot: "accessory",
    rank: 7,
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 10, shield: 12 },
    set: "rei",
  },
  {
    id: "accessory_anel_lendario",
    name: "Anel Lendário",
    slot: "accessory",
    rank: 9,
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 16, shield: 20 },
    set: "lendario",
  },
] as const satisfies readonly EquipmentDef[];

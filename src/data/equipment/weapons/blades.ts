import type { EquipmentDef } from "@/utils/types/player/equipment";

export const BLADES = [
  {
    id: "weapon_espada_ferro",
    name: "Espada de Ferro",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
  },
  {
    id: "weapon_caneta_azul",
    name: "Caneta Azul",
    slot: "weapon",
    rank: 1,
    stats: { strength: 1 },
  },
  {
    id: "weapon_bengala_juju",
    name: "Bengala de Juju",
    slot: "weapon",
    rank: 1,
    stats: { strength: 2 },
  },
  {
    id: "weapon_faca_osso",
    name: "Faca de Osso",
    slot: "weapon",
    rank: 1,
    stats: { strength: 1 },
  },
  {
    id: "weapon_lamina_arcana",
    name: "Lâmina Arcana",
    slot: "weapon",
    rank: 3,
    stats: { strength: 1, intelligence: 1 },
  },
  {
    id: "weapon_espada_rei",
    name: "Espada do Rei",
    slot: "weapon",
    rank: 5,
    stats: { strength: 3, intelligence: 1, vampirism: 1, trueDamage: 1 },
  },
  {
    id: "weapon_martelo_guerra",
    name: "Martelo de Guerra",
    slot: "weapon",
    rank: 7,
    stats: { strength: 4, vampirism: 2, maxHpDamage: 1, trueDamage: 2 },
  },
  {
    id: "weapon_espadao_artur",
    name: "Espadão do Rei Artur",
    slot: "weapon",
    rank: 9,
    stats: {
      strength: 5,
      intelligence: 4,
      vampirism: 3,
      maxHpDamage: 2,
      trueDamage: 4,
    },
  },
] as const satisfies readonly EquipmentDef[];

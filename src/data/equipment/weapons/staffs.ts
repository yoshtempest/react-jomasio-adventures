import { createEquipmentList } from "@/utils/equipment/createEquipmentList";

export const STAFFS = createEquipmentList("weapon", [
  {
    id: "weapon_cajado_runas",
    name: "Cajado de Runas",
    rank: 3,
    stats: { spirit: 3 },
  },
  {
    id: "weapon_elder_wand",
    name: "Varinha das Varinhas",
    rank: 9,
    stats: { spirit: 30, vampirism: 5, trueDamage: 10 },
  },
  {
    id: "weapon_odin_stuff",
    name: "Cajado de odin",
    rank: 9,
    stats: { spirit: 30, vampirism: 5, trueDamage: 10 },
  },
  {
    id: "weapon_cetro_real",
    name: "Cetro Real",
    rank: 7,
    stats: { strength: 2, spirit: 3, vampirism: 2, trueDamage: 2 },
  },
  {
    id: "weapon_cetro_real",
    name: "Cetro Grande",
    rank: 8,
    stats: {
      strength: 2,
      spirit: 3,
      vampirism: 2,
      maxHpDamage: 1,
      trueDamage: 3,
    },
  },
  {
    id: "weapon_cajado_aprendiz",
    name: "Cajado do Aprendiz",
    rank: 1,
    class: "arma",
    stats: { spirit: 1 },
  },
  {
    id: "weapon_cajado_mago",
    name: "Cajado do Mago",
    rank: 3,
    class: "arma",
    stats: { spirit: 2, shield: 1 },
  },
  {
    id: "weapon_cajado_arquimago",
    name: "Cajado do Arquimago",
    rank: 5,
    class: "arma",
    stats: { spirit: 3, shield: 2, maxHpDamage: 1 },
  },
  {
    id: "weapon_cajado_mago_mestre",
    name: "Cajado do Mago Mestre",
    rank: 7,
    class: "arma",
    stats: { spirit: 4, shield: 3, maxHpDamage: 1, trueDamage: 1 },
  },
  {
    id: "weapon_cajado_real_arquimago",
    name: "Cajado Real do Arquimago",
    rank: 9,
    class: "arma",
    stats: { spirit: 5, shield: 5, maxHpDamage: 2, trueDamage: 2 },
  },
]);

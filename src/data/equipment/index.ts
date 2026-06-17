import type { Equipment, EquipmentSlot } from "@/utils/types/player/equipment";

const EQUIPMENT_DB: Equipment[] = [
  // ── Weapons ──
  {
    id: "weapon_caneta_azul",
    name: "Caneta Azul",
    slot: "weapon",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 0 },
  },
  {
    id: "weapon_bengala_juju",
    name: "Bengala de Juju",
    slot: "weapon",
    rank: "common",
    stats: { hp: 0, strength: 2, intelligence: 0, armor: 0 },
  },
  {
    id: "weapon_livro_mestre",
    name: "Livro do Mestre",
    slot: "weapon",
    rank: "common",
    stats: { hp: 0, strength: 0, intelligence: 2, armor: 0 },
  },
  {
    id: "weapon_faca_osso",
    name: "Faca de Osso",
    slot: "weapon",
    rank: "common",
    stats: { hp: 1, strength: 0, intelligence: 0, armor: 0 },
  },
  {
    id: "weapon_lamina_arcana",
    name: "Lâmina Arcana",
    slot: "weapon",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 0 },
  },
  {
    id: "weapon_arco_preciso",
    name: "Arco Preciso",
    slot: "weapon",
    rank: "rare",
    stats: { hp: 0, strength: 2, intelligence: 1, armor: 0 },
  },
  {
    id: "weapon_cajado_runas",
    name: "Cajado de Runas",
    slot: "weapon",
    rank: "rare",
    stats: { hp: 0, strength: 0, intelligence: 3, armor: 0 },
  },
  {
    id: "weapon_espada_rei",
    name: "Espada do Rei",
    slot: "weapon",
    rank: "epic",
    stats: { hp: 2, strength: 3, intelligence: 1, armor: 0 },
  },
  {
    id: "weapon_cajado_arcano",
    name: "Cajado Arcano",
    slot: "weapon",
    rank: "epic",
    stats: { hp: 1, strength: 1, intelligence: 3, armor: 0 },
  },
  {
    id: "weapon_martelo_guerra",
    name: "Martelo de Guerra",
    slot: "weapon",
    rank: "boss",
    stats: { hp: 3, strength: 4, intelligence: 0, armor: 0 },
  },
  {
    id: "weapon_cetro_real",
    name: "Cetro Real",
    slot: "weapon",
    rank: "boss",
    stats: { hp: 2, strength: 2, intelligence: 3, armor: 0 },
  },
  {
    id: "weapon_espadao_artur",
    name: "Espadão do Rei Artur",
    slot: "weapon",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 0 },
  },

  // ── Helmets ──
  {
    id: "helmet_chapeu_cendeiro",
    name: "Chapéu de Cendeiro",
    slot: "helmet",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 2 },
  },
  {
    id: "helmet_touca_algodao",
    name: "Touca de Algodão",
    slot: "helmet",
    rank: "common",
    stats: { hp: 2, strength: 0, intelligence: 0, armor: 1 },
  },
  {
    id: "helmet_faixa_cabeca",
    name: "Faixa de Cabeça",
    slot: "helmet",
    rank: "common",
    stats: { hp: 0, strength: 0, intelligence: 1, armor: 1 },
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
    stats: { hp: 0, strength: 2, intelligence: 0, armor: 5 },
  },
  {
    id: "helmet_coroa_arcana",
    name: "Coroa Arcana",
    slot: "helmet",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 8 },
  },
  {
    id: "helmet_elmo_reforcado",
    name: "Elmo Reforçado",
    slot: "helmet",
    rank: "epic",
    stats: { hp: 0, strength: 2, intelligence: 0, armor: 10 },
  },
  {
    id: "helmet_coroa_rei",
    name: "Coroa do Rei",
    slot: "helmet",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 14 },
  },
  {
    id: "helmet_tapa_olho_surica",
    name: "Tapa olho de Surica",
    slot: "helmet",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 22 },
  },

  // ── Chestplates ──
  {
    id: "chestplate_regata_baiano",
    name: "Regata do Baiano",
    slot: "chestplate",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 3 },
  },
  {
    id: "chestplate_colete_couro",
    name: "Colete de Couro",
    slot: "chestplate",
    rank: "common",
    stats: { hp: 0, strength: 0, intelligence: 1, armor: 4 },
  },
  {
    id: "chestplate_armadura_aco",
    name: "Armadura de Aço",
    slot: "chestplate",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 7 },
  },
  {
    id: "chestplate_peitoral_reforcado",
    name: "Peitoral Reforçado",
    slot: "chestplate",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 14 },
  },
  {
    id: "chestplate_camisa_insider",
    name: "Camisa da Insider",
    slot: "chestplate",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 22 },
  },
  {
    id: "chestplate_armadura_lendaria",
    name: "Armadura Lendária",
    slot: "chestplate",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 35 },
  },

  // ── Pants ──
  {
    id: "pants_calcas_remendadas",
    name: "Calças Remendadas",
    slot: "pants",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 2 },
  },
  {
    id: "pants_grevas_ferro",
    name: "Grevas de Ferro",
    slot: "pants",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 4 },
  },
  {
    id: "pants_calcas_reforcadas",
    name: "Calças Reforçadas",
    slot: "pants",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 8 },
  },
  {
    id: "pants_calca_rei",
    name: "Calça do Rei",
    slot: "pants",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 14 },
  },
  {
    id: "pants_calcas_lendarias",
    name: "Calças Lendárias",
    slot: "pants",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 22 },
  },

  // ── Boots ──
  {
    id: "boots_chinelos_babidi",
    name: "Chinelos de Babidi",
    slot: "boots",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 1 },
  },
  {
    id: "boots_sandalias_humildade",
    name: "Sandálias da Humildade",
    slot: "boots",
    rank: "common",
    stats: { hp: 0, strength: 0, intelligence: 1, armor: 1 },
  },
  {
    id: "boots_botas_couro",
    name: "Botas de Couro",
    slot: "boots",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 3 },
  },
  {
    id: "boots_botas_epicas",
    name: "Botas Épicas",
    slot: "boots",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 6 },
  },
  {
    id: "boots_grevas_rei",
    name: "Grevas do Rei",
    slot: "boots",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 10 },
  },
  {
    id: "boots_botas_lendarias",
    name: "Botas Lendárias",
    slot: "boots",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 16 },
  },

  // ── Accessories ──
  {
    id: "accessory_anel_latao",
    name: "Anel de Latão",
    slot: "accessory",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 1 },
  },
  {
    id: "accessory_colar_osso",
    name: "Colar de Osso",
    slot: "accessory",
    rank: "common",
    stats: { hp: 2, strength: 0, intelligence: 0, armor: 0 },
  },
  {
    id: "accessory_anel_prata",
    name: "Anel de Prata",
    slot: "accessory",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 3 },
  },
  {
    id: "accessory_anel_ouro",
    name: "Anel de Ouro",
    slot: "accessory",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 6 },
  },
  {
    id: "accessory_anel_rei",
    name: "Anel do Rei",
    slot: "accessory",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 10 },
  },
  {
    id: "accessory_anel_lendario",
    name: "Anel Lendário",
    slot: "accessory",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 16 },
  },

  // ── Bags ──
  {
    id: "bag_bolsa_pano",
    name: "Bolsa de Pano",
    slot: "bag",
    rank: "common",
    stats: { hp: 1, strength: 1, intelligence: 0, armor: 0 },
    bonusSlots: 20,
  },
  {
    id: "bag_mochila_couro",
    name: "Mochila de Couro",
    slot: "bag",
    rank: "rare",
    stats: { hp: 1, strength: 1, intelligence: 1, armor: 0 },
    bonusSlots: 40,
  },
  {
    id: "bag_mochila_reforcada",
    name: "Mochila Reforçada",
    slot: "bag",
    rank: "epic",
    stats: { hp: 2, strength: 2, intelligence: 1, armor: 0 },
    bonusSlots: 70,
  },
  {
    id: "bag_mochila_rei",
    name: "Mochila do Rei",
    slot: "bag",
    rank: "boss",
    stats: { hp: 3, strength: 3, intelligence: 2, armor: 0 },
    bonusSlots: 100,
  },
  {
    id: "bag_distorce_espaco",
    name: "Distorce Espaço-Tempo",
    slot: "bag",
    rank: "legendary",
    stats: { hp: 4, strength: 5, intelligence: 4, armor: 0 },
    bonusSlots: Infinity,
  },

  // ── Pet ──
  {
    id: "pet_goat",
    name: "Bodão",
    slot: "pet",
    rank: "epic",
    stats: { hp: 0, strength: 0, intelligence: 0, armor: 0 },
  },
];

export const EQUIPMENT_LIST: Equipment[] = EQUIPMENT_DB;

export function getEquipmentById(id: EquipmentId): Equipment | undefined {
  return EQUIPMENT_DB.find((e) => e.id === id);
}

export function getEquipmentBySlot(slot: EquipmentSlot): Equipment[] {
  return EQUIPMENT_DB.filter((e) => e.slot === slot);
}

export function getEquipmentByRank(rank: EquipmentRank): Equipment[] {
  return EQUIPMENT_DB.filter((e) => e.rank === rank);
}

export function getEquipmentBySlotAndRank(
  slot: EquipmentSlot,
  rank: EquipmentRank,
): Equipment[] {
  return EQUIPMENT_DB.filter((e) => e.slot === slot && e.rank === rank);
}

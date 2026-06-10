import type { Equipment, EquipmentRank, EquipmentSlot } from "@/utils/types/player/equipment";

type EquipmentConfig = {
  id: EquipmentId;
  name: string;
  slot: EquipmentSlot;
  rank: EquipmentRank;
  hp: number;
  strength: number;
  intelligence: number;
};

const STATS_BY_RANK: Record<EquipmentRank, { hp: number; strength: number; intelligence: number }> = {
  common: { hp: 1, strength: 1, intelligence: 0 },
  rare: { hp: 2, strength: 2, intelligence: 1 },
  epic: { hp: 4, strength: 3, intelligence: 2 },
  boss: { hp: 7, strength: 5, intelligence: 4 },
  legendary: { hp: 10, strength: 8, intelligence: 7 },
};

const NAMES: Record<EquipmentSlot, Record<EquipmentRank, string>> = {
  helmet: {
    common: "Chapéu de Cendeiro",
    rare: "Yvel glasses",
    epic: "Coroa Arcana",
    boss: "Coroa do Rei",
    legendary: "Tapa olho de Surica",
  },
  chestplate: {
    common: "Regata do Baiano",
    rare: "Armadura de Aço",
    epic: "Peitoral Reforçado",
    boss: "Camisa da Insider",
    legendary: "Armadura Lendária",
  },
  pants: {
    common: "Calças Remendadas",
    rare: "Grevas de Ferro",
    epic: "Calças Reforçadas",
    boss: "Calça do Rei",
    legendary: "Calças Lendárias",
  },
  boots: {
    common: "Chinelos de Babidi",
    rare: "Botas de Couro",
    epic: "Botas Épicas",
    boss: "Grevas do Rei",
    legendary: "Botas Lendárias",
  },
};

function buildEquipment(config: EquipmentConfig): Equipment {
  return {
    id: config.id,
    name: config.name,
    slot: config.slot,
    rank: config.rank,
    stats: {
      hp: config.hp,
      strength: config.strength,
      intelligence: config.intelligence,
    },
  };
}

function generateAll(): Equipment[] {
  const list: Equipment[] = [];
  const slots: EquipmentSlot[] = ["helmet", "chestplate", "pants", "boots"];
  const ranks: EquipmentRank[] = ["common", "rare", "epic", "boss", "legendary"];

  for (const slot of slots) {
    for (const rank of ranks) {
      const stats = STATS_BY_RANK[rank];
      list.push(
        buildEquipment({
          id: `${slot}_${rank}`,
          name: NAMES[slot][rank],
          slot,
          rank,
          hp: stats.hp,
          strength: stats.strength,
          intelligence: stats.intelligence,
        })
      );
    }
  }

  return list;
}

export const EQUIPMENT_LIST: Equipment[] = generateAll();

export function getEquipmentById(id: EquipmentId): Equipment | undefined {
  return EQUIPMENT_LIST.find((e) => e.id === id);
}

export function getEquipmentBySlot(slot: EquipmentSlot): Equipment[] {
  return EQUIPMENT_LIST.filter((e) => e.slot === slot);
}

export function getEquipmentByRank(rank: EquipmentRank): Equipment[] {
  return EQUIPMENT_LIST.filter((e) => e.rank === rank);
}

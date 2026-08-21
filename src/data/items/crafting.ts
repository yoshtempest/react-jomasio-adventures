export const CRAFT_MATERIALS = {
  hungry_essence: { id: "hungry_essence", name: "Essência de Morto" },
  goat_horn: { id: "goat_horn", name: "Chifre de Cabra" },
  figurant_totem: { id: "figurant_totem", name: "Totem de Figurante" },
  rare_scale: { id: "rare_scale", name: "Escama Rara" },
  epic_core: { id: "epic_core", name: "Núcleo Épico" },
  boss_soul: { id: "boss_soul", name: "Alma de Chefão" },
  legendary_fragment: {
    id: "legendary_fragment",
    name: "Fragmento Lendário",
  },
} as const satisfies Record<string, { id: ItemId; name: string }>;

export type MaterialId = keyof typeof CRAFT_MATERIALS;

type DropEntry = { id: string; chance: number; qty?: [number, number] };

type ClassDropTable = {
  always: DropEntry[];
  perNpcType?: Record<string, DropEntry[]>;
};

export const CRAFT_DROP_TABLES: Record<string, ClassDropTable> = {
  common: {
    always: [{ id: "hungry_essence", chance: 0.6, qty: [1, 3] }],
    perNpcType: {
      rice: [{ id: "porcao_arroz", chance: 0.5, qty: [1, 2] }],
      figurantOfBaalCult: [{ id: "figurant_totem", chance: 0.4, qty: [1, 2] }],
      figurantOfMobyDickCult: [
        { id: "figurant_totem", chance: 0.4, qty: [1, 2] },
      ],
      figurantOfDragonKingCult: [
        { id: "figurant_totem", chance: 0.4, qty: [1, 2] },
      ],
    },
  },
  rare: {
    always: [{ id: "rare_scale", chance: 0.5, qty: [1, 2] }],
    perNpcType: {
      goat: [
        { id: "goat_horn", chance: 0.7, qty: [1, 2] },
        { id: "queijo_cabra", chance: 0.6, qty: [1, 2] },
      ],
      piupiu: [{ id: "ovo_piupiu", chance: 0.5, qty: [1, 2] }],
    },
  },
  epic: {
    always: [{ id: "epic_core", chance: 0.4, qty: [1, 2] }],
  },
  boss: {
    always: [{ id: "boss_soul", chance: 1.0, qty: [1, 1] }],
  },
  legendary: {
    always: [{ id: "legendary_fragment", chance: 1.0, qty: [1, 1] }],
  },
};

export function rollCraftDrops(
  npcClass: string,
  npcType: string,
): Record<string, number> {
  const drops: Record<string, number> = {};
  const table = CRAFT_DROP_TABLES[npcClass];
  if (!table) return drops;

  for (const entry of table.always) {
    if (Math.random() < entry.chance) {
      const [min, max] = entry.qty ?? [1, 1];
      const qty = Math.floor(Math.random() * (max - min + 1)) + min;
      drops[entry.id] = (drops[entry.id] ?? 0) + qty;
    }
  }

  if (table.perNpcType) {
    const typeDrops = table.perNpcType[npcType];
    if (typeDrops) {
      for (const entry of typeDrops) {
        if (Math.random() < entry.chance) {
          const [min, max] = entry.qty ?? [1, 1];
          const qty = Math.floor(Math.random() * (max - min + 1)) + min;
          drops[entry.id] = (drops[entry.id] ?? 0) + qty;
        }
      }
    }
  }

  return drops;
}

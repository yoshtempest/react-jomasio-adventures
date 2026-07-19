import { rollSlotDrop } from "@/data/equipment/drops";
import { getEquipmentBySlotAndRank, getEquipmentById } from "@/data/equipment";
import { rollCraftDrops, CRAFT_MATERIALS } from "@/data/items/crafting";
import { ITEMS } from "@/data/items";
import type { InventoryItem } from "@/utils/types/player/inventory";

export function rollEnhance(): number {
  return Math.floor(Math.random() * 6);
}

export function rollEquipmentDrops(
  npcClass: NPCClass,
  addDrop: (character: CharacterId, id: EquipmentId, enhance?: number) => void,
  character: CharacterId,
): EquipmentDropInfo[] {
  const drops: EquipmentDropInfo[] = [];
  const slots: EquipmentSlot[] = [
    "weapon",
    "helmet",
    "chestplate",
    "pants",
    "boots",
    "accessory",
    "bag",
  ];

  for (const slot of slots) {
    const rank = rollSlotDrop(npcClass);
    if (!rank) continue;
    if (rank === "EX") continue;
    if (rank >= 9) continue;

    const candidates = getEquipmentBySlotAndRank(slot, rank);
    if (candidates.length === 0) continue;

    const equipment = candidates[Math.floor(Math.random() * candidates.length)];
    const enhance = rollEnhance();
    addDrop(character, equipment.id, enhance);
    drops.push({
      id: equipment.id,
      name: equipment.name,
      slot: equipment.slot,
      rank: equipment.rank,
      enhance,
    });
  }

  return drops;
}

export function rollMaterialDrops(
  npcClass: NPCClass,
  npcType: string,
  addItem: (item: InventoryItem) => boolean,
): ItemDropInfo[] {
  const drops: ItemDropInfo[] = [];
  const materialDrops = rollCraftDrops(npcClass, npcType);

  for (const [materialId, qty] of Object.entries(materialDrops)) {
    const craftDef = CRAFT_MATERIALS[materialId];
    if (craftDef) {
      addItem({ id: craftDef.id as ItemId });
      drops.push({ id: craftDef.id, name: craftDef.name, qty });
      continue;
    }

    const def = ITEMS[materialId as keyof typeof ITEMS];
    if (!def) continue;

    const image = "image" in def ? def.image : undefined;
    addItem({ id: def.id });
    drops.push({ id: def.id, name: def.name, qty, image });
  }

  return drops;
}

export function rollChestDrop(
  npcClass: NPCClass,
  addItem: (item: InventoryItem) => boolean,
  chance: number,
): { id: string; name: string } | null {
  if (Math.random() >= chance) return null;

  const chestId = `${npcClass}_chest` as const;
  const def = ITEMS[chestId as keyof typeof ITEMS];
  if (!def) return null;

  addItem({ id: def.id });
  return { id: def.id, name: def.name };
}

export function rollKeyDrop(
  npcClass: NPCClass,
  addItem: (item: InventoryItem) => boolean,
  chance: number,
): { id: string; name: string } | null {
  if (Math.random() >= chance) return null;

  const keyId = `${npcClass}_key` as const;
  const def = ITEMS[keyId as keyof typeof ITEMS];
  if (!def) return null;

  addItem({ id: def.id });
  return { id: def.id, name: def.name };
}

export function rollPetGoat(
  npcType: string,
  addDrop: (character: CharacterId, id: EquipmentId, enhance?: number) => void,
  character: CharacterId,
): EquipmentDropInfo | null {
  if (!npcType.startsWith("goat")) return null;
  if (Math.random() >= 0.01) return null;

  const enhance = rollEnhance();
  addDrop(character, "pet_goat", enhance);
  const pet = getEquipmentById("pet_goat");
  if (!pet) return null;

  return {
    id: pet.id,
    name: pet.name,
    slot: pet.slot,
    rank: pet.rank,
    enhance,
  };
}

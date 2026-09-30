import { getEquipmentBySlotAndRank } from "@/data/equipment";
import { rollEnhance } from "./rollEnhance";
import { rollSlotDrop } from "@/data/equipment/drops";

export function rollEquipmentDrops(
  npcClass: NPCClass,
  addDrop: (character: CharacterId, id: EquipmentId, enhance?: number) => void,
  character: CharacterId,
  luckBonus: number,
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
    const rank = rollSlotDrop(npcClass, luckBonus);
    if (!rank) continue;
    if (rank === "EX") continue;
    if (rank >= 9) continue;

    const candidates = getEquipmentBySlotAndRank(slot, rank).filter(
      (e) => !e.craftOnly,
    );
    if (candidates.length === 0) continue;

    const equipment =
      candidates[Math.floor(Math.random() * candidates.length)]!;
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

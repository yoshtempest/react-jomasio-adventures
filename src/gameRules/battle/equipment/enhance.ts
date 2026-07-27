import type { EquipmentStats } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";

export function getEnhanceBonus(
  itemId: string,
  enhance: number,
): EquipmentStats {
  const bonus: EquipmentStats = {
    hp: 0,
    strength: 0,
    intelligence: 0,
    armor: 0,
    shield: 0,
    vampirism: 0,
    reflect: 0,
    tenacity: 0,
    luck: 0,
    maxHpDamage: 0,
    trueDamage: 0,
  };
  if (enhance <= 0) return bonus;

  const item = getEquipmentById(itemId);
  if (!item) return bonus;

  const avail: (keyof EquipmentStats)[] = [];
  if ((item.stats.hp ?? 0) > 0) avail.push("hp");
  if ((item.stats.strength ?? 0) > 0) avail.push("strength");
  if ((item.stats.intelligence ?? 0) > 0) avail.push("intelligence");
  if ((item.stats.armor ?? 0) > 0) avail.push("armor");
  if ((item.stats.shield ?? 0) > 0) avail.push("shield");
  if ((item.stats.maxHpDamage ?? 0) > 0) avail.push("maxHpDamage");

  if (avail.length === 0) return bonus;

  let seed = 0;
  for (let i = 0; i < itemId.length; i++) {
    seed = ((seed << 5) - seed + itemId.charCodeAt(i)) | 0;
  }

  for (let i = 0; i < enhance; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const idx = seed % avail.length;
    bonus[avail[idx]] += 1;
  }

  return bonus;
}

export function getEffectiveStats(
  itemId: string,
  enhance: number,
): EquipmentStats {
  const item = getEquipmentById(itemId);
  if (!item)
    return {
      hp: 0,
      strength: 0,
      intelligence: 0,
      armor: 0,
      shield: 0,
      vampirism: 0,
      reflect: 0,
      tenacity: 0,
      luck: 0,
      maxHpDamage: 0,
      trueDamage: 0,
    };
  const enhanceBonus = getEnhanceBonus(itemId, enhance);
  return {
    hp: (item.stats.hp ?? 0) + enhanceBonus.hp,
    strength: (item.stats.strength ?? 0) + enhanceBonus.strength,
    intelligence: (item.stats.intelligence ?? 0) + enhanceBonus.intelligence,
    armor: (item.stats.armor ?? 0) + enhanceBonus.armor,
    shield: (item.stats.shield ?? 0) + enhanceBonus.shield,
    vampirism: item.stats.vampirism ?? 0,
    reflect: item.stats.reflect ?? 0,
    tenacity: item.stats.tenacity ?? 0,
    luck: item.stats.luck ?? 0,
    maxHpDamage: (item.stats.maxHpDamage ?? 0) + enhanceBonus.maxHpDamage,
    trueDamage: item.stats.trueDamage ?? 0,
  };
}

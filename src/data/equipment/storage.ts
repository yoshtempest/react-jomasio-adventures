import type {
  EquippedItems,
  EquippedItemInfo,
} from "@/utils/types/player/equipment";
import { createEmptyEquipped, EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import { saveCompressed, loadCompressed } from "@/utils/storage";

export type CharacterEquipmentData = {
  equipped: EquippedItems;
  collection: Record<string, number>;
};

const EQUIP_KEY = "jomasio_equipment";

export function colKey(id: EquipmentId, enhance: number): string {
  return `${id}+${enhance}`;
}

function migrateEquipped(slot: unknown): EquippedItemInfo | null {
  if (!slot) return null;
  if (typeof slot === "string") return { id: slot, enhance: 0 };
  if (typeof slot === "object" && slot !== null) {
    const s = slot as Record<string, unknown>;
    return { id: String(s.id ?? ""), enhance: Number(s.enhance ?? 0) };
  }
  return null;
}

function createEmptyCharacterData(character?: string): CharacterEquipmentData {
  const equipped = createEmptyEquipped();
  const collection: Record<string, number> = {};

  if (character === "marcelo") {
    equipped.weapon = { id: "weapon_espada_ferro", enhance: 0 };
    collection[colKey("weapon_espada_ferro", 0)] = 1;
  }

  return { equipped, collection };
}

function migrateAllData(
  raw: Record<string, unknown>,
): Record<string, CharacterEquipmentData> {
  const result: Record<string, CharacterEquipmentData> = {};
  for (const [key, val] of Object.entries(raw)) {
    if (!val || typeof val !== "object") continue;
    const d = val as Record<string, unknown>;
    const equipped = createEmptyEquipped();
    const rawEquip = d.equipped as Record<string, unknown> | undefined;
    if (rawEquip) {
      for (const s of EQUIPMENT_SLOTS) {
        equipped[s] = migrateEquipped(rawEquip[s]);
      }
      if (Array.isArray(rawEquip.accessories)) {
        equipped.accessories = rawEquip.accessories.map(
          (a: unknown) => migrateEquipped(a) ?? { id: "", enhance: 0 },
        ).filter((a: EquippedItemInfo) => a.id !== "");
      }
    }
    const collection: Record<string, number> = {};
    const rawCol = d.collection as Record<string, number> | undefined;
    if (rawCol) {
      for (const [k, qty] of Object.entries(rawCol)) {
        if (qty > 0) {
          if (k.includes("+")) {
            collection[k] = qty;
          } else {
            collection[colKey(k, 0)] = qty;
          }
        }
      }
    }
    result[key] = { equipped, collection };
  }
  return result as Record<string, CharacterEquipmentData>;
}

function createEmptyAllData(): Record<string, CharacterEquipmentData> {
  return {} as Record<string, CharacterEquipmentData>;
}

export function loadAllData(): Record<string, CharacterEquipmentData> {
  try {
    const parsed = loadCompressed<Record<string, unknown>>(EQUIP_KEY);
    if (!parsed) return createEmptyAllData();
    if (typeof parsed !== "object") return createEmptyAllData();
    const firstVal = Object.values(parsed)[0];
    if (
      firstVal &&
      typeof firstVal === "object" &&
      "equipped" in (firstVal as object)
    ) {
      const equipped = (firstVal as Record<string, unknown>).equipped;
      if (equipped && typeof equipped === "object") {
        const sample = Object.values(equipped as Record<string, unknown>)[0];
        if (typeof sample === "string" || sample === null) {
          return migrateAllData(parsed as Record<string, unknown>);
        }
      }
    }
    const data = parsed as Record<string, CharacterEquipmentData>;
    for (const charData of Object.values(data)) {
      if (charData?.equipped && !Array.isArray(charData.equipped.accessories)) {
        (charData.equipped as EquippedItems).accessories = [];
      }
    }
    return data;
  } catch {
    return createEmptyAllData();
  }
}

export function saveAllData(
  allData: Record<string, CharacterEquipmentData>,
): void {
  saveCompressed(EQUIP_KEY, allData);
}

export function loadEquipped(character: CharacterId): EquippedItems {
  try {
    const all = loadAllData();
    const data = all[character];
    if (!data) return createEmptyEquipped();
    return {
      ...data.equipped,
      accessories: [...data.equipped.accessories],
    };
  } catch {
    return createEmptyEquipped();
  }
}

export function getCharacterData(
  all: Record<string, CharacterEquipmentData>,
  character: CharacterId,
): CharacterEquipmentData {
  if (!all[character]) {
    all[character] = createEmptyCharacterData(character);
  }
  return all[character];
}

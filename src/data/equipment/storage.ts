import type {
  EquipmentSlot,
  EquippedItems,
  EquippedItemInfo,
} from "@/utils/types/player/equipment";
import { createEmptyEquipped } from "@/utils/types/player/equipment";

type CharacterEquipmentData = {
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

function createEmptyCharacterData(): CharacterEquipmentData {
  return { equipped: createEmptyEquipped(), collection: {} };
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
      for (const s of Object.keys(equipped) as EquipmentSlot[]) {
        equipped[s] = migrateEquipped(rawEquip[s]);
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
    const raw = localStorage.getItem(EQUIP_KEY);
    if (!raw) return createEmptyAllData();
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null)
      return createEmptyAllData();
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
    return parsed as Record<string, CharacterEquipmentData>;
  } catch {
    return createEmptyAllData();
  }
}

export function saveAllData(
  allData: Record<string, CharacterEquipmentData>,
): void {
  localStorage.setItem(EQUIP_KEY, JSON.stringify(allData));
}

export function getCharacterData(
  all: Record<string, CharacterEquipmentData>,
  character: CharacterId,
): CharacterEquipmentData {
  if (!all[character]) {
    all[character] = createEmptyCharacterData();
  }
  return all[character];
}

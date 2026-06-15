import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { EquipmentSlot, EquippedItems, Equipment, EquippedItemInfo } from "@/utils/types/player/equipment";
import { createEmptyEquipped } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import { getEffectiveStats } from "@/gameRules/battle/equipment";

type CharacterEquipmentData = {
  equipped: EquippedItems;
  collection: Record<string, number>;
};

type EquipmentContextType = {
  getEquippedItem: (character: CharacterId, slot: EquipmentSlot) => Equipment | null;
  getEquippedInfo: (character: CharacterId, slot: EquipmentSlot) => EquippedItemInfo | null;
  getTotalBonus: (character: CharacterId) => { hp: number; strength: number; intelligence: number };
  getCollection: (character: CharacterId) => Record<string, number>;
  getQuantityTotal: (character: CharacterId, id: EquipmentId) => number;
  getQuantity: (character: CharacterId, id: EquipmentId, enhance: number) => number;
  isOwned: (character: CharacterId, id: EquipmentId) => boolean;
  equip: (character: CharacterId, id: EquipmentId, enhance?: number) => void;
  unequip: (character: CharacterId, slot: EquipmentSlot) => void;
  addDrop: (character: CharacterId, id: EquipmentId, enhance?: number) => void;
};

/* eslint-disable react-refresh/only-export-components */

const EquipmentContext = createContext<EquipmentContextType | null>(null);

const EQUIP_KEY = "jomasio_equipment";

function colKey(id: EquipmentId, enhance: number): string {
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

function migrateAllData(raw: Record<string, unknown>): Record<CharacterId, CharacterEquipmentData> {
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
  return result as Record<CharacterId, CharacterEquipmentData>;
}

function createEmptyAllData(): Record<CharacterId, CharacterEquipmentData> {
  return {} as Record<CharacterId, CharacterEquipmentData>;
}

function loadAllData(): Record<CharacterId, CharacterEquipmentData> {
  try {
    const raw = localStorage.getItem(EQUIP_KEY);
    if (!raw) return createEmptyAllData();
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return createEmptyAllData();
    const firstVal = Object.values(parsed)[0];
    if (firstVal && typeof firstVal === "object" && "equipped" in (firstVal as object)) {
      const equipped = (firstVal as Record<string, unknown>).equipped;
      if (equipped && typeof equipped === "object") {
        const sample = Object.values(equipped as Record<string, unknown>)[0];
        if (typeof sample === "string" || sample === null) {
          return migrateAllData(parsed as Record<string, unknown>);
        }
      }
    }
    return parsed as Record<CharacterId, CharacterEquipmentData>;
  } catch {
    return createEmptyAllData();
  }
}

function getCharacterData(
  all: Record<CharacterId, CharacterEquipmentData>,
  character: CharacterId
): CharacterEquipmentData {
  if (!all[character]) {
    all[character] = createEmptyCharacterData();
  }
  return all[character];
}

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [allData, setAllData] = useState<Record<CharacterId, CharacterEquipmentData>>(createEmptyAllData);

  useEffect(() => {
    setAllData(loadAllData());
  }, []);

  useEffect(() => {
    localStorage.setItem(EQUIP_KEY, JSON.stringify(allData));
  }, [allData]);

  const getEquippedItem = useCallback(
    (character: CharacterId, slot: EquipmentSlot): Equipment | null => {
      const data = getCharacterData(allData, character);
      const info = data.equipped[slot];
      if (!info) return null;
      return getEquipmentById(info.id) ?? null;
    },
    [allData]
  );

  const getEquippedInfo = useCallback(
    (character: CharacterId, slot: EquipmentSlot): EquippedItemInfo | null => {
      return getCharacterData(allData, character).equipped[slot];
    },
    [allData]
  );

  const getTotalBonus = useCallback(
    (character: CharacterId): { hp: number; strength: number; intelligence: number } => {
      const data = getCharacterData(allData, character);
      const bonus = { hp: 0, strength: 0, intelligence: 0 };
      for (const slot of Object.keys(data.equipped) as EquipmentSlot[]) {
        const info = data.equipped[slot];
        if (!info) continue;
        const stats = getEffectiveStats(info.id, info.enhance);
        bonus.hp += stats.hp;
        bonus.strength += stats.strength;
        bonus.intelligence += stats.intelligence;
      }
      return bonus;
    },
    [allData]
  );

  const getCollection = useCallback(
    (character: CharacterId): Record<string, number> => {
      return getCharacterData(allData, character).collection;
    },
    [allData]
  );

  const getQuantityTotal = useCallback(
    (character: CharacterId, id: EquipmentId): number => {
      const collection = getCharacterData(allData, character).collection;
      let total = 0;
      for (const [key, qty] of Object.entries(collection)) {
        if (key.startsWith(id + "+") || key === id) {
          total += qty;
        }
      }
      return total;
    },
    [allData]
  );

  const getQuantity = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number): number => {
      return getCharacterData(allData, character).collection[colKey(id, enhance)] ?? 0;
    },
    [allData]
  );

  const isOwned = useCallback(
    (character: CharacterId, id: EquipmentId): boolean => {
      return getQuantityTotal(character, id) > 0;
    },
    [getQuantityTotal]
  );

  const equip = useCallback((character: CharacterId, id: EquipmentId, enhance: number = 0) => {
    const item = getEquipmentById(id);
    if (!item) return;
    const key = colKey(id, enhance);

    setAllData((prev) => {
      const next = { ...prev };
      const data = { ...getCharacterData(next, character) };
      const collection = { ...data.collection };

      if (!collection[key] || collection[key] <= 0) return prev;

      const oldInfo = data.equipped[item.slot];
      collection[key] -= 1;
      if (collection[key] <= 0) delete collection[key];

      const equipped = { ...data.equipped, [item.slot]: { id, enhance } } as EquippedItems;

      if (oldInfo) {
        const oldKey = colKey(oldInfo.id, oldInfo.enhance);
        collection[oldKey] = (collection[oldKey] ?? 0) + 1;
      }

      next[character] = { equipped, collection };
      return next;
    });
  }, []);

  const unequip = useCallback((character: CharacterId, slot: EquipmentSlot) => {
    setAllData((prev) => {
      const next = { ...prev };
      const data = { ...getCharacterData(next, character) };
      const oldInfo = data.equipped[slot];
      if (!oldInfo) return prev;

      const collection = { ...data.collection };
      const oldKey = colKey(oldInfo.id, oldInfo.enhance);
      collection[oldKey] = (collection[oldKey] ?? 0) + 1;

      const equipped = { ...data.equipped, [slot]: null };

      next[character] = { equipped, collection };
      return next;
    });
  }, []);

  const addDrop = useCallback((character: CharacterId, id: EquipmentId, enhance: number = 0) => {
    const key = colKey(id, enhance);
    setAllData((prev) => {
      const next = { ...prev };
      const data = { ...getCharacterData(next, character) };
      const collection = { ...data.collection };
      collection[key] = (collection[key] ?? 0) + 1;
      next[character] = { ...data, collection };
      return next;
    });
  }, []);

  return (
    <EquipmentContext.Provider
      value={{
        getEquippedItem,
        getEquippedInfo,
        getTotalBonus,
        getCollection,
        getQuantityTotal,
        getQuantity,
        isOwned,
        equip,
        unequip,
        addDrop,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  const ctx = useContext(EquipmentContext);
  if (!ctx) throw new Error("useEquipment precisa do EquipmentProvider");
  return ctx;
}

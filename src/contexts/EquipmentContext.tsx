import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  EquipmentSlot,
  EquippedItems,
  Equipment,
  EquippedItemInfo,
} from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import { getEffectiveStats } from "@/gameRules/battle/equipment";
import { colKey, loadAllData, saveAllData, getCharacterData } from "@/data/equipment/storage";

type CharacterEquipmentData = {
  equipped: EquippedItems;
  collection: Record<string, number>;
};

type EquipmentContextType = {
  getEquippedItem: (
    character: CharacterId,
    slot: EquipmentSlot,
  ) => Equipment | null;
  getEquippedInfo: (
    character: CharacterId,
    slot: EquipmentSlot,
  ) => EquippedItemInfo | null;
  getTotalBonus: (character: CharacterId) => {
    hp: number;
    strength: number;
    intelligence: number;
  };
  getCollection: (character: CharacterId) => Record<string, number>;
  getQuantityTotal: (character: CharacterId, id: EquipmentId) => number;
  getQuantity: (
    character: CharacterId,
    id: EquipmentId,
    enhance: number,
  ) => number;
  isOwned: (character: CharacterId, id: EquipmentId) => boolean;
  equip: (character: CharacterId, id: EquipmentId, enhance?: number) => void;
  unequip: (character: CharacterId, slot: EquipmentSlot) => void;
  addDrop: (character: CharacterId, id: EquipmentId, enhance?: number) => void;
};

/* eslint-disable react-refresh/only-export-components */

const EquipmentContext = createContext<EquipmentContextType | null>(null);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [allData, setAllData] =
    useState<Record<CharacterId, CharacterEquipmentData>>({} as Record<CharacterId, CharacterEquipmentData>);

  useEffect(() => {
    setAllData(loadAllData() as Record<CharacterId, CharacterEquipmentData>);
  }, []);

  useEffect(() => {
    saveAllData(allData as Record<string, CharacterEquipmentData>);
  }, [allData]);

  const getEquippedItem = useCallback(
    (character: CharacterId, slot: EquipmentSlot): Equipment | null => {
      const data = getCharacterData(allData as Record<string, CharacterEquipmentData>, character);
      const info = data.equipped[slot];
      if (!info) return null;
      return getEquipmentById(info.id) ?? null;
    },
    [allData],
  );

  const getEquippedInfo = useCallback(
    (character: CharacterId, slot: EquipmentSlot): EquippedItemInfo | null => {
      return getCharacterData(allData as Record<string, CharacterEquipmentData>, character).equipped[slot];
    },
    [allData],
  );

  const getTotalBonus = useCallback(
    (
      character: CharacterId,
    ): { hp: number; strength: number; intelligence: number } => {
      const data = getCharacterData(allData as Record<string, CharacterEquipmentData>, character);
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
    [allData],
  );

  const getCollection = useCallback(
    (character: CharacterId): Record<string, number> => {
      return getCharacterData(allData as Record<string, CharacterEquipmentData>, character).collection;
    },
    [allData],
  );

  const getQuantityTotal = useCallback(
    (character: CharacterId, id: EquipmentId): number => {
      const collection = getCharacterData(allData as Record<string, CharacterEquipmentData>, character).collection;
      let total = 0;
      for (const [key, qty] of Object.entries(collection)) {
        if (key.startsWith(id + "+") || key === id) {
          total += qty;
        }
      }
      return total;
    },
    [allData],
  );

  const getQuantity = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number): number => {
      return (
        getCharacterData(allData as Record<string, CharacterEquipmentData>, character).collection[colKey(id, enhance)] ??
        0
      );
    },
    [allData],
  );

  const isOwned = useCallback(
    (character: CharacterId, id: EquipmentId): boolean => {
      return getQuantityTotal(character, id) > 0;
    },
    [getQuantityTotal],
  );

  const equip = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number = 0) => {
      const item = getEquipmentById(id);
      if (!item) return;
      const key = colKey(id, enhance);

      setAllData((prev) => {
        const next = { ...prev };
        const data = { ...getCharacterData(next as Record<string, CharacterEquipmentData>, character) };
        const collection = { ...data.collection };

        if (!collection[key] || collection[key] <= 0) return prev;

        const oldInfo = data.equipped[item.slot];
        collection[key] -= 1;
        if (collection[key] <= 0) delete collection[key];

        const equipped = {
          ...data.equipped,
          [item.slot]: { id, enhance },
        } as EquippedItems;

        if (oldInfo) {
          const oldKey = colKey(oldInfo.id, oldInfo.enhance);
          collection[oldKey] = (collection[oldKey] ?? 0) + 1;
        }

        next[character] = { equipped, collection } as CharacterEquipmentData;
        return next;
      });
    },
    [],
  );

  const unequip = useCallback((character: CharacterId, slot: EquipmentSlot) => {
    setAllData((prev) => {
      const next = { ...prev };
      const data = { ...getCharacterData(next as Record<string, CharacterEquipmentData>, character) };
      const oldInfo = data.equipped[slot];
      if (!oldInfo) return prev;

      const collection = { ...data.collection };
      const oldKey = colKey(oldInfo.id, oldInfo.enhance);
      collection[oldKey] = (collection[oldKey] ?? 0) + 1;

      const equipped = { ...data.equipped, [slot]: null };

      next[character] = { equipped, collection } as CharacterEquipmentData;
      return next;
    });
  }, []);

  const addDrop = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number = 0) => {
      const key = colKey(id, enhance);
      setAllData((prev) => {
        const next = { ...prev };
        const data = { ...getCharacterData(next as Record<string, CharacterEquipmentData>, character) };
        const collection = { ...data.collection };
        collection[key] = (collection[key] ?? 0) + 1;
        next[character] = { ...data, collection } as CharacterEquipmentData;
        return next;
      });
    },
    [],
  );

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

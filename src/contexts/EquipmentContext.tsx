import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { EquipmentSlot, EquippedItems, Equipment } from "@/utils/types/player/equipment";
import { createEmptyEquipped } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";

type CharacterEquipmentData = {
  equipped: EquippedItems;
  collection: Record<EquipmentId, number>;
};

type EquipmentContextType = {
  getEquippedItem: (character: CharacterId, slot: EquipmentSlot) => Equipment | null;
  getTotalBonus: (character: CharacterId) => { hp: number; strength: number; intelligence: number };
  getCollection: (character: CharacterId) => Record<EquipmentId, number>;
  getQuantity: (character: CharacterId, id: EquipmentId) => number;
  isOwned: (character: CharacterId, id: EquipmentId) => boolean;
  equip: (character: CharacterId, id: EquipmentId) => void;
  unequip: (character: CharacterId, slot: EquipmentSlot) => void;
  addDrop: (character: CharacterId, id: EquipmentId) => void;
};

/* eslint-disable react-refresh/only-export-components */

const EquipmentContext = createContext<EquipmentContextType | null>(null);

const EQUIP_KEY = "jomasio_equipment";

function createEmptyCharacterData(): CharacterEquipmentData {
  return { equipped: createEmptyEquipped(), collection: {} };
}

function createEmptyAllData(): Record<CharacterId, CharacterEquipmentData> {
  return {} as Record<CharacterId, CharacterEquipmentData>;
}

function loadAllData(): Record<CharacterId, CharacterEquipmentData> {
  try {
    const raw = localStorage.getItem(EQUIP_KEY);
    if (!raw) return createEmptyAllData();
    return JSON.parse(raw);
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
      const id = data.equipped[slot];
      if (!id) return null;
      return getEquipmentById(id) ?? null;
    },
    [allData]
  );

  const getTotalBonus = useCallback(
    (character: CharacterId): { hp: number; strength: number; intelligence: number } => {
      const data = getCharacterData(allData, character);
      const bonus = { hp: 0, strength: 0, intelligence: 0 };
      for (const slot of Object.keys(data.equipped) as EquipmentSlot[]) {
        const id = data.equipped[slot];
        if (!id) continue;
        const item = getEquipmentById(id);
        if (!item) continue;
        bonus.hp += item.stats.hp;
        bonus.strength += item.stats.strength;
        bonus.intelligence += item.stats.intelligence;
      }
      return bonus;
    },
    [allData]
  );

  const getCollection = useCallback(
    (character: CharacterId): Record<EquipmentId, number> => {
      return getCharacterData(allData, character).collection;
    },
    [allData]
  );

  const getQuantity = useCallback(
    (character: CharacterId, id: EquipmentId): number => {
      return getCharacterData(allData, character).collection[id] ?? 0;
    },
    [allData]
  );

  const isOwned = useCallback(
    (character: CharacterId, id: EquipmentId): boolean => {
      return getQuantity(character, id) > 0;
    },
    [getQuantity]
  );

  const equip = useCallback((character: CharacterId, id: EquipmentId) => {
    const item = getEquipmentById(id);
    if (!item) return;

    setAllData((prev) => {
      const next = { ...prev };
      const data = { ...getCharacterData(next, character) };
      const collection = { ...data.collection };

      if (!collection[id] || collection[id] <= 0) return prev;

      const oldId = data.equipped[item.slot];
      collection[id] -= 1;
      if (collection[id] <= 0) delete collection[id];

      const equipped = { ...data.equipped, [item.slot]: id };

      if (oldId) {
        collection[oldId] = (collection[oldId] ?? 0) + 1;
      }

      next[character] = { equipped, collection };
      return next;
    });
  }, []);

  const unequip = useCallback((character: CharacterId, slot: EquipmentSlot) => {
    setAllData((prev) => {
      const next = { ...prev };
      const data = { ...getCharacterData(next, character) };
      const oldId = data.equipped[slot];
      if (!oldId) return prev;

      const collection = { ...data.collection };
      collection[oldId] = (collection[oldId] ?? 0) + 1;

      const equipped = { ...data.equipped, [slot]: null };

      next[character] = { equipped, collection };
      return next;
    });
  }, []);

  const addDrop = useCallback((character: CharacterId, id: EquipmentId) => {
    setAllData((prev) => {
      const next = { ...prev };
      const data = { ...getCharacterData(next, character) };
      const collection = { ...data.collection };
      collection[id] = (collection[id] ?? 0) + 1;
      next[character] = { ...data, collection };
      return next;
    });
  }, []);

  return (
    <EquipmentContext.Provider
      value={{
        getEquippedItem,
        getTotalBonus,
        getCollection,
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

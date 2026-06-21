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
import { MAX_ACCESSORIES, EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import {
  getEffectiveStats,
  SET_MULTIPLIER,
  SET_SLOTS,
} from "@/gameRules/battle/equipment";
import {
  colKey,
  loadAllData,
  saveAllData,
  getCharacterData,
} from "@/data/equipment/storage";

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
  getEquippedAccessories: (character: CharacterId) => EquippedItemInfo[];
  getTotalBonus: (character: CharacterId) => {
    hp: number;
    strength: number;
    intelligence: number;
    shield: number;
    vampirism: number;
    reflect: number;
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
  unequipAccessoryAtIndex: (character: CharacterId, index: number) => void;
  addDrop: (character: CharacterId, id: EquipmentId, enhance?: number) => void;
};

/* eslint-disable react-refresh/only-export-components */

const EquipmentContext = createContext<EquipmentContextType | null>(null);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [allData, setAllData] = useState<
    Record<CharacterId, CharacterEquipmentData>
  >(() => loadAllData() as Record<CharacterId, CharacterEquipmentData>);

  useEffect(() => {
    saveAllData(allData as Record<string, CharacterEquipmentData>);
  }, [allData]);

  const getEquippedItem = useCallback(
    (character: CharacterId, slot: EquipmentSlot): Equipment | null => {
      const data = getCharacterData(
        allData as Record<string, CharacterEquipmentData>,
        character,
      );
      const info = data.equipped[slot];
      if (!info) return null;
      return getEquipmentById(info.id) ?? null;
    },
    [allData],
  );

  const getEquippedInfo = useCallback(
    (character: CharacterId, slot: EquipmentSlot): EquippedItemInfo | null => {
      return getCharacterData(
        allData as Record<string, CharacterEquipmentData>,
        character,
      ).equipped[slot];
    },
    [allData],
  );

  const getEquippedAccessories = useCallback(
    (character: CharacterId): EquippedItemInfo[] => {
      return getCharacterData(
        allData as Record<string, CharacterEquipmentData>,
        character,
      ).equipped.accessories;
    },
    [allData],
  );

  function addItemBonus(
    bonus: { hp: number; strength: number; intelligence: number; shield: number; vampirism: number; reflect: number },
    info: EquippedItemInfo,
    setItemIds: Set<string>,
  ) {
    const stats = getEffectiveStats(info.id, info.enhance);
    const multiplier = setItemIds.has(info.id) ? SET_MULTIPLIER : 1;
    bonus.hp += Math.round(stats.hp * multiplier);
    bonus.strength += Math.round(stats.strength * multiplier);
    bonus.intelligence += Math.round(stats.intelligence * multiplier);
    bonus.shield += Math.round(stats.shield * multiplier);
    bonus.vampirism += Math.round(stats.vampirism * multiplier);
    bonus.reflect += Math.round(stats.reflect * multiplier);
  }

  function buildSetItemIds(equipped: EquippedItems): Set<string> {
    const setPieces: Record<string, string[]> = {};
    for (const slot of SET_SLOTS) {
      const info = equipped[slot];
      if (!info) continue;
      const item = getEquipmentById(info.id);
      if (!item?.set) continue;
      if (!setPieces[item.set]) setPieces[item.set] = [];
      setPieces[item.set].push(info.id);
    }
    for (const acc of equipped.accessories) {
      const item = getEquipmentById(acc.id);
      if (!item?.set) continue;
      if (!setPieces[item.set]) setPieces[item.set] = [];
      setPieces[item.set].push(acc.id);
    }
    const setItemIds = new Set<string>();
    for (const ids of Object.values(setPieces)) {
      if (ids.length >= 3) {
        for (const id of ids) setItemIds.add(id);
      }
    }
    return setItemIds;
  }

  const getTotalBonus = useCallback(
    (
      character: CharacterId,
    ): { hp: number; strength: number; intelligence: number; shield: number; vampirism: number; reflect: number } => {
      const data = getCharacterData(
        allData as Record<string, CharacterEquipmentData>,
        character,
      );

      const setItemIds = buildSetItemIds(data.equipped);
      const bonus = { hp: 0, strength: 0, intelligence: 0, shield: 0, vampirism: 0, reflect: 0 };

      for (const slot of EQUIPMENT_SLOTS) {
        const info = data.equipped[slot];
        if (!info) continue;
        addItemBonus(bonus, info, setItemIds);
      }
      for (const info of data.equipped.accessories) {
        addItemBonus(bonus, info, setItemIds);
      }

      return bonus;
    },
    [allData],
  );

  const getCollection = useCallback(
    (character: CharacterId): Record<string, number> => {
      return getCharacterData(
        allData as Record<string, CharacterEquipmentData>,
        character,
      ).collection;
    },
    [allData],
  );

  const getQuantityTotal = useCallback(
    (character: CharacterId, id: EquipmentId): number => {
      const collection = getCharacterData(
        allData as Record<string, CharacterEquipmentData>,
        character,
      ).collection;
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
        getCharacterData(
          allData as Record<string, CharacterEquipmentData>,
          character,
        ).collection[colKey(id, enhance)] ?? 0
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
        const data = {
          ...getCharacterData(
            next as Record<string, CharacterEquipmentData>,
            character,
          ),
        };
        const collection = { ...data.collection };

        if (!collection[key] || collection[key] <= 0) return prev;

        collection[key] -= 1;
        if (collection[key] <= 0) delete collection[key];

        if (item.slot === "accessory") {
          const baseSlot = data.equipped.accessory;
          const extras = data.equipped.accessories;

          if (!baseSlot) {
            const equipped = {
              ...data.equipped,
              accessory: { id, enhance },
            };
            next[character] = { equipped, collection } as CharacterEquipmentData;
            return next;
          }

          if (extras.length >= MAX_ACCESSORIES) {
            collection[key] = (collection[key] ?? 0) + 1;
            return prev;
          }

          const equipped = {
            ...data.equipped,
            accessories: [...extras, { id, enhance }],
          };
          next[character] = { equipped, collection } as CharacterEquipmentData;
          return next;
        }

        const oldInfo = data.equipped[item.slot];
        const equipped = {
          ...data.equipped,
          [item.slot]: { id, enhance },
        };

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
      const data = {
        ...getCharacterData(
          next as Record<string, CharacterEquipmentData>,
          character,
        ),
      };

      if (slot === "accessory") {
        const extras = data.equipped.accessories;
        if (extras.length > 0) {
          const lastInfo = extras[extras.length - 1];
          const collection = { ...data.collection };
          const oldKey = colKey(lastInfo.id, lastInfo.enhance);
          collection[oldKey] = (collection[oldKey] ?? 0) + 1;

          const equipped = {
            ...data.equipped,
            accessories: extras.slice(0, -1),
          };
          next[character] = { equipped, collection } as CharacterEquipmentData;
          return next;
        }
      }

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

  const unequipAccessoryAtIndex = useCallback(
    (character: CharacterId, index: number) => {
      setAllData((prev) => {
        const next = { ...prev };
        const data = {
          ...getCharacterData(
            next as Record<string, CharacterEquipmentData>,
            character,
          ),
        };

        const extras = data.equipped.accessories;
        if (index < 0 || index >= extras.length) return prev;

        const info = extras[index];
        const collection = { ...data.collection };
        const oldKey = colKey(info.id, info.enhance);
        collection[oldKey] = (collection[oldKey] ?? 0) + 1;

        const equipped = {
          ...data.equipped,
          accessories: extras.filter((_, i) => i !== index),
        };

        next[character] = { equipped, collection } as CharacterEquipmentData;
        return next;
      });
    },
    [],
  );

  const addDrop = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number = 0) => {
      const key = colKey(id, enhance);
      setAllData((prev) => {
        const next = { ...prev };
        const data = {
          ...getCharacterData(
            next as Record<string, CharacterEquipmentData>,
            character,
          ),
        };
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
        getEquippedAccessories,
        getTotalBonus,
        getCollection,
        getQuantityTotal,
        getQuantity,
        isOwned,
        equip,
        unequip,
        unequipAccessoryAtIndex,
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

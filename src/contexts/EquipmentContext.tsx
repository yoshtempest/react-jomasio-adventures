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
  Equipment,
  EquippedItemInfo,
} from "@/utils/types/player/equipment";
import { EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";
import {
  buildSetItemIds,
  addItemBonus,
} from "@/gameRules/battle/equipment";
import {
  loadAllData,
  saveAllData,
  getCharacterData,
  colKey,
  type CharacterEquipmentData,
} from "@/data/equipment/storage";
import {
  equipItem,
  unequipItem,
  unequipAccessoryAt,
  addDrop as addDropOp,
} from "@/gameRules/equipment/operations";

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

  const getTotalBonus = useCallback(
    (character: CharacterId) => {
      const data = getCharacterData(
        allData as Record<string, CharacterEquipmentData>,
        character,
      );

      const setItemIds = buildSetItemIds(data.equipped);
      const bonus = {
        hp: 0, strength: 0, intelligence: 0,
        shield: 0, vampirism: 0, reflect: 0,
      };

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
      setAllData((prev) => {
        const next = equipItem(
          prev as Record<string, CharacterEquipmentData>,
          character,
          id,
          enhance,
        );
        return (next ?? prev) as Record<CharacterId, CharacterEquipmentData>;
      });
    },
    [],
  );

  const unequip = useCallback(
    (character: CharacterId, slot: EquipmentSlot) => {
      setAllData((prev) => {
        const next = unequipItem(
          prev as Record<string, CharacterEquipmentData>,
          character,
          slot,
        );
        return (next ?? prev) as Record<CharacterId, CharacterEquipmentData>;
      });
    },
    [],
  );

  const unequipAccessoryAtIndex = useCallback(
    (character: CharacterId, index: number) => {
      setAllData((prev) => {
        const next = unequipAccessoryAt(
          prev as Record<string, CharacterEquipmentData>,
          character,
          index,
        );
        return (next ?? prev) as Record<CharacterId, CharacterEquipmentData>;
      });
    },
    [],
  );

  const addDrop = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number = 0) => {
      setAllData((prev) =>
        addDropOp(
          prev as Record<string, CharacterEquipmentData>,
          character,
          id,
          enhance,
        ) as Record<CharacterId, CharacterEquipmentData>,
      );
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

// eslint-disable-next-line react-refresh/only-export-components
export function useEquipment() {
  const ctx = useContext(EquipmentContext);
  if (!ctx) throw new Error("useEquipment precisa do EquipmentProvider");
  return ctx;
}

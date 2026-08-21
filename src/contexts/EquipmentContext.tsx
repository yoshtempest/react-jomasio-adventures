import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Equipment,
  EquippedItemInfo,
} from "@/utils/types/player/equipment";
import { EQUIPMENT_SLOTS } from "@/data/equipment/definitions";
import { getEquipmentById } from "@/data/equipment";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { buildSetItemIds, addItemBonus } from "@/gameRules/battle/equipment";
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
  fusePets as fusePetsOp,
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
    tenacity: number;
    luck: number;
    maxHpDamage: number;
    trueDamage: number;
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
  fusePets: (
    character: CharacterId,
    petId: EquipmentId,
    stars: number,
  ) => boolean;
};

/* eslint-disable react-refresh/only-export-components */

const EquipmentContext = createContext<EquipmentContextType | null>(null);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [allData, setAllData] = useState<
    Record<CharacterId, CharacterEquipmentData>
  >(() => loadAllData());

  useEffect(() => {
    saveAllData(allData);
  }, [allData]);

  const { playSound } = useSoundEffects();

  const getEquippedItem = useCallback(
    (character: CharacterId, slot: EquipmentSlot): Equipment | null => {
      const data = getCharacterData(allData, character);
      const info = data.equipped[slot];
      if (!info) return null;
      return getEquipmentById(info.id) ?? null;
    },
    [allData],
  );

  const getEquippedInfo = useCallback(
    (character: CharacterId, slot: EquipmentSlot): EquippedItemInfo | null => {
      return getCharacterData(allData, character).equipped[slot];
    },
    [allData],
  );

  const getEquippedAccessories = useCallback(
    (character: CharacterId): EquippedItemInfo[] => {
      return getCharacterData(allData, character).equipped.accessories;
    },
    [allData],
  );

  const getTotalBonus = useCallback(
    (character: CharacterId) => {
      const data = getCharacterData(allData, character);

      const setItemIds = buildSetItemIds(data.equipped);
      const bonus = {
        hp: 0,
        strength: 0,
        intelligence: 0,
        shield: 0,
        vampirism: 0,
        reflect: 0,
        tenacity: 0,
        luck: 0,
        maxHpDamage: 0,
        trueDamage: 0,
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
      return getCharacterData(allData, character).collection;
    },
    [allData],
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
    [allData],
  );

  const getQuantity = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number): number => {
      return (
        getCharacterData(allData, character).collection[colKey(id, enhance)] ??
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
      playSound("equip");
      setAllData((prev) => {
        const next = equipItem(prev, character, id, enhance);
        return next ?? prev;
      });
    },
    [playSound],
  );

  const unequip = useCallback(
    (character: CharacterId, slot: EquipmentSlot) => {
      playSound("unequip");
      setAllData((prev) => {
        const next = unequipItem(prev, character, slot);
        return next ?? prev;
      });
    },
    [playSound],
  );

  const unequipAccessoryAtIndex = useCallback(
    (character: CharacterId, index: number) => {
      playSound("unequip");
      setAllData((prev) => {
        const next = unequipAccessoryAt(prev, character, index);
        return next ?? prev;
      });
    },
    [playSound],
  );

  const addDrop = useCallback(
    (character: CharacterId, id: EquipmentId, enhance: number = 0) => {
      setAllData((prev) => addDropOp(prev, character, id, enhance));
    },
    [],
  );

  const fusePets = useCallback(
    (character: CharacterId, petId: EquipmentId, stars: number): boolean => {
      const next = fusePetsOp(allData, character, petId, stars);
      if (!next) return false;
      setAllData(next);
      return true;
    },
    [allData],
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
        fusePets,
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

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { EquipmentSlot, EquippedItems, Equipment } from "@/utils/types/player/equipment";
import { createEmptyEquipped } from "@/utils/types/player/equipment";
import { getEquipmentById } from "@/data/equipment";

type EquipmentContextType = {
  equipped: EquippedItems;
  collection: EquipmentId[];

  equip: (id: EquipmentId) => void;
  unequip: (slot: EquipmentSlot) => void;
  addDrop: (id: EquipmentId) => void;

  getEquippedItem: (slot: EquipmentSlot) => Equipment | null;
  getTotalBonus: () => { hp: number; strength: number; intelligence: number };

  hasEquipped: (slot: EquipmentSlot) => boolean;
  isOwned: (id: EquipmentId) => boolean;
};

/* eslint-disable react-refresh/only-export-components */

const EquipmentContext = createContext<EquipmentContextType | null>(null);

const EQUIP_KEY = "jomasio_equipment";

function loadEquipData(): { equipped: EquippedItems; collection: EquipmentId[] } {
  try {
    const raw = localStorage.getItem(EQUIP_KEY);
    if (!raw) return { equipped: createEmptyEquipped(), collection: [] };
    const parsed = JSON.parse(raw);
    return {
      equipped: { ...createEmptyEquipped(), ...parsed.equipped },
      collection: Array.isArray(parsed.collection) ? parsed.collection : [],
    };
  } catch {
    return { equipped: createEmptyEquipped(), collection: [] };
  }
}

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipped, setEquipped] = useState<EquippedItems>(createEmptyEquipped());
  const [collection, setCollection] = useState<EquipmentId[]>([]);

  useEffect(() => {
    const data = loadEquipData();
    setEquipped(data.equipped);
    setCollection(data.collection);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      EQUIP_KEY,
      JSON.stringify({ equipped, collection })
    );
  }, [equipped, collection]);

  function equip(id: EquipmentId) {
    const item = getEquipmentById(id);
    if (!item) return;

    setEquipped((prev) => ({ ...prev, [item.slot]: id }));
  }

  function unequip(slot: EquipmentSlot) {
    setEquipped((prev) => ({ ...prev, [slot]: null }));
  }

  function addDrop(id: EquipmentId) {
    setCollection((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }

  function getEquippedItem(slot: EquipmentSlot): Equipment | null {
    const id = equipped[slot];
    if (!id) return null;
    return getEquipmentById(id) ?? null;
  }

  function getTotalBonus() {
    const bonus = { hp: 0, strength: 0, intelligence: 0 };
    for (const slot of Object.keys(equipped) as EquipmentSlot[]) {
      const id = equipped[slot];
      if (!id) continue;
      const item = getEquipmentById(id);
      if (!item) continue;
      bonus.hp += item.stats.hp;
      bonus.strength += item.stats.strength;
      bonus.intelligence += item.stats.intelligence;
    }
    return bonus;
  }

  function hasEquipped(slot: EquipmentSlot) {
    return equipped[slot] !== null;
  }

  function isOwned(id: EquipmentId) {
    return collection.includes(id);
  }

  return (
    <EquipmentContext.Provider
      value={{
        equipped,
        collection,
        equip,
        unequip,
        addDrop,
        getEquippedItem,
        getTotalBonus,
        hasEquipped,
        isOwned,
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

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { useSoundEffects, type SoundId } from "@/contexts/SoundEffectsContext";
import { INVENTORY_KEY } from "@/data/storageKeys";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useCompressedStorage } from "@/hooks/useCompressedStorage";
import { useToggle } from "@/hooks/useToggle";

const CURRENCY_SLOT_COUNT = 2;

type InventoryContextType = {
  items: InventoryItem[];

  addItem: (item: InventoryItem) => boolean;
  removeItem: (id: ItemId) => void;
  hasItem: (id: ItemId) => boolean;

  isOpen: boolean;
  openInventory: () => void;
  closeInventory: () => void;
  toggleInventory: () => void;
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  maxSlots: number;
  setMaxSlots: (slots: number) => void;
};

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useCompressedStorage<InventoryItem[]>(
    INVENTORY_KEY,
    [],
  );
  const { playSound } = useSoundEffects();

  const {
    isOpen,
    open: openInventory,
    close: closeInventory,
    toggle: toggleInventory,
  } = useToggle();

  const [maxSlots, setMaxSlots] = useState(20);
  const maxSlotsRef = useLatestRef(maxSlots);

  const pendingSoundsRef = useRef<SoundId[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach((s) => playSound(s));
  }, [items, playSound]);

  function addItem(item: InventoryItem): boolean {
    let added = false;

    setItems((prev) => {
      pendingSoundsRef.current = [];

      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        pendingSoundsRef.current.push("receivedItem");

        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: (i.qty ?? 1) + (item.qty ?? 1) } : i,
        );
      }

      if (prev.length >= maxSlotsRef.current - CURRENCY_SLOT_COUNT) {
        return prev;
      }

      pendingSoundsRef.current.push("receivedItem");
      added = true;

      return [...prev, { id: item.id, qty: item.qty ?? 1 }];
    });

    return added;
  }

  function removeItem(id: ItemId) {
    const found = items.find((i) => i.id === id);
    if (!found) return;

    pendingSoundsRef.current = [];

    setItems((prev) => {
      const next = prev
        .map((i) => {
          if (i.id !== id) return i;
          const nextQty = (i.qty ?? 1) - 1;
          return nextQty <= 0 ? null : { ...i, qty: nextQty };
        })
        .filter((item): item is InventoryItem => item !== null);

      if (next.length < prev.length) {
        pendingSoundsRef.current.push("usedItem");
      }

      return next;
    });
  }

  function hasItem(id: ItemId) {
    return items.some((item) => item.id === id);
  }

  return (
    <InventoryContext.Provider
      value={{
        items,
        setItems,
        addItem,
        removeItem,
        hasItem,
        isOpen,
        openInventory,
        closeInventory,
        toggleInventory,
        maxSlots,
        setMaxSlots,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context)
    throw new Error("useInventory deve ser usado dentro do Provider");
  return context;
}

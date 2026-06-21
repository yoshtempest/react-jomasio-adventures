import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { saveCompressed, loadCompressed } from "@/utils/storage";
import { INVENTORY_KEY } from "@/data/storageKeys";

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
  const [items, setItems] = useState<InventoryItem[]>(() =>
    loadCompressed<InventoryItem[]>(INVENTORY_KEY) ?? [],
  );
  const { playSound } = useSoundEffects();

  useEffect(() => {
    saveCompressed(INVENTORY_KEY, items);
  }, [items]);

  const [isOpen, setIsOpen] = useState(false);

  const [maxSlots, setMaxSlots] = useState(20);
  const maxSlotsRef = useRef(maxSlots);
  maxSlotsRef.current = maxSlots;

  function addItem(item: InventoryItem): boolean {
    let added = false;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        playSound("receivedItem");
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: (i.qty ?? 1) + (item.qty ?? 1) } : i,
        );
      }

      const max = maxSlotsRef.current;
      if (prev.length >= max) {
        return prev;
      }

      playSound("receivedItem");
      added = true;
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
    return added;
  }

  function removeItem(id: ItemId) {
    const found = items.find((i) => i.id === id);
    if (!found) return;

    setItems((prev) => {
      const next = prev
        .map((i) => {
          if (i.id !== id) return i;
          const nextQty = (i.qty ?? 1) - 1;
          return nextQty <= 0 ? null : { ...i, qty: nextQty };
        })
        .filter(Boolean) as InventoryItem[];

      return next;
    });

    playSound("usedItem");
  }

  function hasItem(id: ItemId) {
    return items.some((item) => item.id === id);
  }

  function toggleInventory() {
    setIsOpen((prev) => !prev);
  }

  function openInventory() {
    setIsOpen(true);
  }

  function closeInventory() {
    setIsOpen(false);
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

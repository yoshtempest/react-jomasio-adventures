import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

type InventoryContextType = {
  items: InventoryItem[];

  addItem: (item: InventoryItem) => void;
  removeItem: (id: ItemId) => void;
  hasItem: (id: ItemId) => boolean;

  isOpen: boolean;
  openInventory: () => void;
  closeInventory: () => void;
  toggleInventory: () => void;
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
};

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const { playSound } = useSoundEffects();
  
  const [isOpen, setIsOpen] = useState(false);

  function addItem(item: InventoryItem) {
    let added = false;
    setItems((prev) => {
      // impede duplicado
      if (prev.find((i) => i.id === item.id)) return prev;
      added = true;
      return [...prev, item];
    });
    if (added) {
      playSound("receivedItem");
    }
  }

  function removeItem(id: ItemId) {
    const exists = items.some((item) => item.id === id);

    if (!exists) return;

    setItems((prev) => prev.filter((item) => item.id !== id));

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
        toggleInventory
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory deve ser usado dentro do Provider");
  return context;
}
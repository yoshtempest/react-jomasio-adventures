import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { InventoryItem } from "@/utils/types/player/inventory";

type InventoryContextType = {
  items: InventoryItem[];

  addItem: (item: InventoryItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;

  isOpen: boolean;
  openInventory: () => void;
  closeInventory: () => void;
  toggleInventory: () => void;
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
};

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "money",
      name: "200 do pé de meia",
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);


  function addItem(item: InventoryItem) {
    setItems((prev) => {
      // impede duplicado
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function hasItem(id: string) {
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
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useRef,
  useEffect
} from "react";
import type { InventoryItem } from "@/utils/types/player/inventory";
import { asset } from "@/utils/asset";
import type { ItemId } from "@/data/items";

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
  const itemAudioRef = useRef<HTMLAudioElement | null>(null);
  const useItemAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!itemAudioRef.current) {
      itemAudioRef.current = new Audio(
        asset("/assets/songs/soundEffects/player/receivedAnItem.mp3")
      );
    }
  }, []);
  function playItemSound() {
    if (!itemAudioRef.current) return;

    itemAudioRef.current.currentTime = 0;
    itemAudioRef.current.play().catch(() => {});
  }
  useEffect(() => {
    if (!useItemAudioRef.current) {
      useItemAudioRef.current = new Audio(
        asset("/assets/songs/soundEffects/player/usedAnItem.mp3")
      );
    }
  }, []);
  function playUseItemSound() {
    if (!useItemAudioRef.current) return;

    useItemAudioRef.current.currentTime = 0;
    useItemAudioRef.current.play().catch(() => {});
  }
  
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
      playItemSound();
    }
  }

  function removeItem(id: ItemId) {
    const exists = items.some((item) => item.id === id);

    if (!exists) return;

    setItems((prev) => prev.filter((item) => item.id !== id));

    playUseItemSound();
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
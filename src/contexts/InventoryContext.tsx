import {
  createContext,
  useContext,
  useMemo,
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
import { InventoryService } from "@/services/inventory";

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

  const inventoryService = useMemo(
    () => new InventoryService(maxSlots),
    [maxSlots],
  );
  // serviço com capacidade fresca para uso dentro de updaters
  const freshService = () => new InventoryService(maxSlotsRef.current);

  const pendingSoundsRef = useRef<SoundId[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach((s) => playSound(s));
  }, [items, playSound]);

  function addItem(item: InventoryItem): boolean {
    // retorno baseado no estado atual do render (semântica legada)
    const { added } = inventoryService.addItem(items, item);

    setItems((prev) => {
      const result = freshService().addItem(prev, item);
      pendingSoundsRef.current = result.sound ? [result.sound] : [];
      return result.items;
    });

    return added;
  }

  function removeItem(id: ItemId) {
    setItems((prev) => {
      const result = freshService().removeItem(prev, id);
      pendingSoundsRef.current = result.sound ? [result.sound] : [];
      return result.items;
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

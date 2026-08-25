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

  const inventoryService = useMemo(
    () => new InventoryService(maxSlots),
    [maxSlots],
  );

  /**
   * Array mais recente da mochila, incluindo mutações desta mesma tick
   * que o `items` do render ainda não enxerga.
   *
   * Ele existe para que a regra rode fora do updater do `setItems`. Um
   * updater precisa ser puro: o React pode reexecutá-lo (StrictMode em
   * dev reexecuta sempre), então enfileirar som lá dentro duplica ou
   * perde evento. Com o ref carregando o resultado adiante, chamadas
   * encadeadas no mesmo tick — vários `addItem` de um baú, por exemplo —
   * continuam enxergando umas às outras.
   */
  const latestItemsRef = useRef(items);
  latestItemsRef.current = items;

  const pendingSoundsRef = useRef<SoundId[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach((s) => playSound(s));
  }, [items, playSound]);

  function commit(next: InventoryItem[], sound: SoundId | null) {
    latestItemsRef.current = next;
    if (sound) pendingSoundsRef.current.push(sound);
    setItems(next);
  }

  function addItem(item: InventoryItem): boolean {
    const result = inventoryService.addItem(latestItemsRef.current, item);
    commit(result.items, result.sound);
    return result.added;
  }

  function removeItem(id: ItemId) {
    const result = inventoryService.removeItem(latestItemsRef.current, id);
    commit(result.items, result.sound);
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

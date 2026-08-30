import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useFlags } from "@/contexts/FlagContext";
import {
  isUnlockFlag,
  UNLOCK_FLAG_TO_CHAR,
} from "@/utils/character/unlockDate";
import type { CharacterId } from "@/data/characters/list";

type ContextType = {
  /** Personagem a exibir no modal atual (null quando nenhum pendente). */
  current: CharacterId | null;
  /** Fecha o modal atual e revela o próximo da fila, se houver. */
  dismiss: () => void;
};

const CharacterUnlockContext = createContext<ContextType | null>(null);

export function CharacterUnlockProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { flags } = useFlags();

  const [queue, setQueue] = useState<CharacterId[]>([]);
  const seenFlagsRef = useRef<Set<FlagId>>(new Set(flags));

  useEffect(() => {
    const newlyUnlocked: CharacterId[] = [];
    for (const flag of flags) {
      if (seenFlagsRef.current.has(flag)) continue;
      seenFlagsRef.current.add(flag);
      if (isUnlockFlag(flag)) newlyUnlocked.push(UNLOCK_FLAG_TO_CHAR[flag]);
    }
    if (newlyUnlocked.length === 0) return;
    setQueue((prev) => [...prev, ...newlyUnlocked]);
  }, [flags]);

  const dismiss = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  const value = useMemo(
    () => ({ current: queue[0] ?? null, dismiss }),
    [queue, dismiss],
  );

  return (
    <CharacterUnlockContext.Provider value={value}>
      {children}
    </CharacterUnlockContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCharacterUnlock() {
  const ctx = useContext(CharacterUnlockContext);
  if (!ctx)
    throw new Error("useCharacterUnlock precisa do CharacterUnlockProvider");
  return ctx;
}
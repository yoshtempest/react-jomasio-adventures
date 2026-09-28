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

import { getProfessionBadge } from "@/data/professions/badge";
import type { ProfessionId } from "@/utils/types/player/profession";

/**
 * Duração total do badge flutuante. Precisa bater com a duração da animação
 * em `components/Game/ProfessionBadge/styles.module.css` — divergir deixa o
 * badge morto no final ou visível depois de desvanecer.
 */
export const PROFESSION_BADGE_MS = 1000;

type ProfessionBadgeEntry = {
  /** Contador monotônico: é a `key` do elemento, então cada spawn remonta o nó e reinicia a animação. */
  id: number;
  src: string;
};

type ProfessionBadgeContextType = {
  badges: ProfessionBadgeEntry[];
  showProfessionBadge: (profession: ProfessionId) => void;
};

const ProfessionBadgeContext = createContext<ProfessionBadgeContextType | null>(
  null,
);

export function ProfessionBadgeProvider({ children }: { children: ReactNode }) {
  const [badges, setBadges] = useState<ProfessionBadgeEntry[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const showProfessionBadge = useCallback((profession: ProfessionId) => {
    const id = idRef.current++;
    setBadges((prev) => [...prev, { id, src: getProfessionBadge(profession) }]);

    const timer = setTimeout(() => {
      timersRef.current.delete(id);
      setBadges((prev) => prev.filter((b) => b.id !== id));
    }, PROFESSION_BADGE_MS);

    timersRef.current.set(id, timer);
  }, []);

  const value = useMemo(
    () => ({ badges, showProfessionBadge }),
    [badges, showProfessionBadge],
  );

  return (
    <ProfessionBadgeContext.Provider value={value}>
      {children}
    </ProfessionBadgeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfessionBadge(): ProfessionBadgeContextType {
  const context = useContext(ProfessionBadgeContext);

  return context ?? { badges: [], showProfessionBadge: () => {} };
}

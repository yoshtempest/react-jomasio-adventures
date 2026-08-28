import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { loadFlags, saveFlags } from "@/utils/flag/storage";
import { isUnlockFlag, saveUnlockDate } from "@/utils/character/unlockDate";

type FlagContextType = {
  flags: FlagId[];
  setFlag: (flag: FlagId) => void;
  hasFlag: (flag: FlagId) => boolean;
};

type Props = {
  children: ReactNode;
};

const FlagContext = createContext<FlagContextType | null>(null);

export function FlagProvider({ children }: Props) {
  const [flags, setFlags] = useState<FlagId[]>(loadFlags);
  const flagsRef = useLatestRef(flags);

  const setFlag = useCallback((flag: FlagId) => {
    if (flagsRef.current.includes(flag)) return;
    // Fora do updater: StrictMode reexecuta updaters em dev e gravar aqui
    // duplicaria o efeito. A guarda do ref impede rebuilds desnecessários.
    if (isUnlockFlag(flag)) saveUnlockDate(flag);
    setFlags((prev) => {
      if (prev.includes(flag)) return prev;
      return [...prev, flag];
    });
  }, [flagsRef]);

  useEffect(() => {
    saveFlags(flags);
  }, [flags]);

  const hasFlag = useCallback(
    (flag: FlagId) => flags.includes(flag),
    [flags],
  );

  const value = useMemo(
    () => ({ flags, setFlag, hasFlag }),
    [flags, setFlag, hasFlag],
  );

  return (
    <FlagContext.Provider value={value}>
      {children}
    </FlagContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFlags() {
  const ctx = useContext(FlagContext);
  if (!ctx) throw new Error("useFlags precisa do FlagProvider");
  return ctx;
}
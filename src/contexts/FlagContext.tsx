import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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

const FlagContext = createContext({} as FlagContextType);

export function FlagProvider({ children }: Props) {
  const [flags, setFlags] = useState<FlagId[]>(loadFlags);

  function setFlag(flag: FlagId) {
    setFlags((prev) => {
      if (prev.includes(flag)) return prev;
      if (isUnlockFlag(flag)) saveUnlockDate(flag);
      return [...prev, flag];
    });
  }

  useEffect(() => {
    saveFlags(flags);
  }, [flags]);

  function hasFlag(flag: FlagId) {
    return flags.includes(flag);
  }

  return (
    <FlagContext.Provider value={{ flags, setFlag, hasFlag }}>
      {children}
    </FlagContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFlags = () => useContext(FlagContext);

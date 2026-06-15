import { createContext, useContext, useState, type ReactNode } from "react";

type FlagContextType = {
  flags: FlagId[];
  setFlag: (flag: FlagId) => void;
  hasFlag: (flag: FlagId) => boolean;
};

type Props = {
  children: ReactNode;
};

const STORAGE_KEY = "flags";

function loadFlags(): FlagId[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as FlagId[]) : [];
  } catch {
    return [];
  }
}

function saveFlags(flags: FlagId[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}

const FlagContext = createContext({} as FlagContextType);

export function FlagProvider({ children }: Props) {
  const [flags, setFlags] = useState<FlagId[]>(loadFlags);

  function setFlag(flag: FlagId) {
    setFlags((prev) => {
      if (prev.includes(flag)) return prev;
      const next = [...prev, flag];
      saveFlags(next);
      return next;
    });
  }

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

import { createContext, useContext, useState, type ReactNode } from "react";

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
  const [flags, setFlags] = useState<FlagId[]>([]);

  function setFlag(flag: FlagId) {
    setFlags(prev => prev.includes(flag) ? prev : [...prev, flag]);
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

export const useFlags = () => useContext(FlagContext);
import { createContext, useContext, useState, type ReactNode } from "react";

type FlagContextType = {
  flags: string[];
  setFlag: (flag: string) => void;
  hasFlag: (flag: string) => boolean;
};


type Props = {
  children: ReactNode;
};

const FlagContext = createContext({} as FlagContextType);

export function FlagProvider({ children }: Props) {
  const [flags, setFlags] = useState<string[]>([]);

  function setFlag(flag: string) {
    setFlags(prev => prev.includes(flag) ? prev : [...prev, flag]);
  }

  function hasFlag(flag: string) {
    return flags.includes(flag);
  }

  return (
    <FlagContext.Provider value={{ flags, setFlag, hasFlag }}>
      {children}
    </FlagContext.Provider>
  );
}

export const useFlags = () => useContext(FlagContext);
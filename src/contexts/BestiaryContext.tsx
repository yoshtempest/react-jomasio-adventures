import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { BestiarySaveData } from "@/utils/types/player/bestiary";
import { loadBestiary, saveBestiary } from "@/utils/bestiary/storage";

type ContextType = {
  bestiary: BestiarySaveData;
  registerDefeat: (npcType: string) => void;
  hasEncountered: (npcType: string) => boolean;
  getKills: (npcType: string) => number;
};

const BestiaryContext = createContext({} as ContextType);

export function BestiaryProvider({ children }: { children: ReactNode }) {
  const [bestiary, setBestiary] = useState<BestiarySaveData>(loadBestiary);

  useEffect(() => {
    saveBestiary(bestiary);
  }, [bestiary]);

  const registerDefeat = useCallback((npcType: string) => {
    setBestiary((prev) => {
      const current = prev[npcType];
      const wasEncountered = current?.encountered ?? false;
      const prevKills = current?.kills ?? 0;
      return {
        ...prev,
        [npcType]: {
          encountered: true,
          kills: prevKills + 1,
        },
      };
    });
  }, []);

  const hasEncountered = useCallback(
    (npcType: string): boolean => {
      return bestiary[npcType]?.encountered ?? false;
    },
    [bestiary],
  );

  const getKills = useCallback(
    (npcType: string): number => {
      return bestiary[npcType]?.kills ?? 0;
    },
    [bestiary],
  );

  return (
    <BestiaryContext.Provider
      value={{ bestiary, registerDefeat, hasEncountered, getKills }}
    >
      {children}
    </BestiaryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBestiary() {
  return useContext(BestiaryContext);
}

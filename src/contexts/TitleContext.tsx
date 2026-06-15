import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  TitleProgress,
  TitlesData,
  TitleBonusMap,
} from "@/utils/types/player/titles";
import { TITLES, getTitleById } from "@/data/titles";

const STORAGE_KEY = "titles_data";

type ContextType = {
  titlesData: TitlesData;
  getBonus: () => TitleBonusMap;
  incrementKillCounter: (npcType: string, npcClass: string) => void;
  equipTitle: (id: string) => void;
  unequipTitle: () => void;
};

const TitleContext = createContext({} as ContextType);

function getDefaultProgress(): Record<string, TitleProgress> {
  const progress: Record<string, TitleProgress> = {};
  for (const id of Object.keys(TITLES)) {
    progress[id] = { current: 0, level: 0 };
  }
  return progress;
}

function getDefaultData(): TitlesData {
  return {
    equippedId: null,
    totalKills: 0,
    progress: getDefaultProgress(),
  };
}

function loadData(): TitlesData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    const parsed = JSON.parse(raw) as Partial<TitlesData>;

    const progress = getDefaultProgress();
    if (parsed.progress) {
      for (const id of Object.keys(progress)) {
        const saved = parsed.progress[id];
        if (saved) {
          progress[id] = {
            current: saved.current ?? 0,
            level: saved.level ?? 0,
          };
        }
      }
    }

    return {
      equippedId:
        parsed.equippedId && parsed.equippedId in TITLES
          ? parsed.equippedId
          : null,
      totalKills: parsed.totalKills ?? 0,
      progress,
    };
  } catch {
    return getDefaultData();
  }
}

export function TitleProvider({ children }: { children: ReactNode }) {
  const [titlesData, setTitlesData] = useState<TitlesData>(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(titlesData));
  }, [titlesData]);

  const getBonus = useCallback((): TitleBonusMap => {
    const bonus: TitleBonusMap = {
      damage: 0,
      hp: 0,
      strength: 0,
      intelligence: 0,
    };
    if (!titlesData.equippedId) return bonus;

    const title = getTitleById(titlesData.equippedId);
    if (!title) return bonus;

    const progress = titlesData.progress[titlesData.equippedId];
    if (!progress || progress.level === 0) return bonus;

    const levelIndex = progress.level - 1;
    const levelDef = title.levels[levelIndex];
    if (!levelDef) return bonus;

    for (const b of levelDef.bonus) {
      bonus[b.stat] += b.value;
    }

    return bonus;
  }, [titlesData.equippedId, titlesData.progress]);

  const incrementKillCounter = useCallback(
    (npcType: string, npcClass: string) => {
      setTitlesData((prev) => {
        const nextProgress = { ...prev.progress };
        let changed = false;

        for (const titleId of Object.keys(TITLES)) {
          const def = TITLES[titleId];
          const prog = { ...nextProgress[titleId] };
          let shouldIncrement = false;

          if (def.condition.type === "killNpcType") {
            if (npcType.startsWith(def.condition.npcTypePrefix)) {
              shouldIncrement = true;
            }
          } else if (def.condition.type === "killNpcClass") {
            if (npcClass === def.condition.npcClass) {
              shouldIncrement = true;
            }
          } else if (def.condition.type === "killTotal") {
            shouldIncrement = true;
          }

          if (shouldIncrement && prog.level < def.levels.length) {
            const nextCurrent = prog.current + 1;
            const nextLevelTarget = def.levels[prog.level].count;
            const nextLevel =
              nextCurrent >= nextLevelTarget ? prog.level + 1 : prog.level;
            nextProgress[titleId] = {
              current: nextCurrent,
              level: nextLevel,
            };
            changed = true;
          }
        }

        if (!changed) return prev;

        return {
          ...prev,
          totalKills: prev.totalKills + 1,
          progress: nextProgress,
        };
      });
    },
    [],
  );

  const equipTitle = useCallback((id: string) => {
    setTitlesData((prev) => {
      if (!prev.progress[id] || prev.progress[id].level === 0) return prev;
      return { ...prev, equippedId: prev.equippedId === id ? null : id };
    });
  }, []);

  const unequipTitle = useCallback(() => {
    setTitlesData((prev) => ({ ...prev, equippedId: null }));
  }, []);

  return (
    <TitleContext.Provider
      value={{
        titlesData,
        getBonus,
        incrementKillCounter,
        equipTitle,
        unequipTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTitles() {
  return useContext(TitleContext);
}

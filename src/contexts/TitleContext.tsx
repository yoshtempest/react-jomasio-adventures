import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { TitlesData, TitleBonusMap } from "@/utils/types/player/titles";
import { TITLES, getTitleById } from "@/data/titles";
import { loadData, saveData } from "@/utils/titles/storage";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

type ContextType = {
  titlesData: TitlesData;
  getBonus: () => TitleBonusMap;
  incrementKillCounter: (npcType: string, npcClass: string) => void;
  incrementBlockCounter: () => void;
  incrementDamageTaken: (amount: number) => void;
  incrementDamageDealt: (amount: number) => void;
  incrementDodgeCounter: () => void;
  handleDefeat: () => void;
  equipTitle: (id: string) => void;
  unequipTitle: () => void;
};

const TitleContext = createContext({} as ContextType);

function incrementTitles(
  prev: TitlesData,
  conditionType: string,
  amount: number,
  matchFn?: (def: (typeof TITLES)[string]) => boolean,
): TitlesData {
  const nextProgress = { ...prev.progress };
  let changed = false;

  for (const titleId of Object.keys(TITLES)) {
    const def = TITLES[titleId];
    if (def.condition.type !== conditionType) continue;
    if (matchFn && !matchFn(def)) continue;

    const prog = { ...nextProgress[titleId] };
    if (prog.level >= def.levels.length) continue;

    const nextCurrent = prog.current + amount;
    const nextLevelTarget = def.levels[prog.level].count;
    const nextLevel =
      nextCurrent >= nextLevelTarget ? prog.level + 1 : prog.level;

    nextProgress[titleId] = { current: nextCurrent, level: nextLevel };
    changed = true;
  }

  if (!changed) return prev;
  return { ...prev, progress: nextProgress };
}

export function TitleProvider({ children }: { children: ReactNode }) {
  const [titlesData, setTitlesData] = useState<TitlesData>(loadData);

  useEffect(() => {
    saveData(titlesData);
  }, [titlesData]);

  const { playSound } = useSoundEffects();
  const prevProgressRef = useRef(titlesData.progress);

  useEffect(() => {
    const prev = prevProgressRef.current;
    const curr = titlesData.progress;
    for (const id of Object.keys(curr)) {
      const prevLevel = prev[id]?.level ?? 0;
      const currLevel = curr[id]?.level ?? 0;
      if (currLevel > prevLevel) {
        playSound("unlockedTitle");
        break;
      }
    }
    prevProgressRef.current = curr;
  }, [titlesData.progress, playSound]);

  const getBonus = useCallback((): TitleBonusMap => {
    const bonus: TitleBonusMap = {
      damage: 0,
      hp: 0,
      strength: 0,
      intelligence: 0,
      shield: 0,
      armor: 0,
      enemyMissChance: 0,
      percentAllStats: 0,
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
      if (b.stat in bonus) {
        (bonus as Record<string, number>)[b.stat] += b.value;
      }
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
          } else if (def.condition.type === "consecutiveWins") {
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

  const handleDefeat = useCallback(() => {
    setTitlesData((prev) => {
      const nextProgress = { ...prev.progress };
      let changed = false;

      for (const titleId of Object.keys(TITLES)) {
        const def = TITLES[titleId];
        if (def.condition.type !== "consecutiveWins") continue;

        const prog = { ...nextProgress[titleId] };
        const nextCurrent = Math.max(0, prog.current - 10);

        if (nextCurrent === prog.current) continue;

        const nextLevelTarget = def.levels[prog.level]?.count ?? Infinity;
        const nextLevel =
          nextCurrent >= nextLevelTarget ? prog.level + 1 : prog.level;

        nextProgress[titleId] = {
          current: nextCurrent,
          level: nextLevel,
        };
        changed = true;
      }

      if (!changed) return prev;
      return { ...prev, progress: nextProgress };
    });
  }, []);

  const incrementBlockCounter = useCallback(() => {
    setTitlesData((prev) => incrementTitles(prev, "blockCount", 1));
  }, []);

  const incrementDamageTaken = useCallback((amount: number) => {
    setTitlesData((prev) => incrementTitles(prev, "damageTaken", amount));
  }, []);

  const incrementDamageDealt = useCallback((amount: number) => {
    setTitlesData((prev) => incrementTitles(prev, "damageDealt", amount));
  }, []);

  const incrementDodgeCounter = useCallback(() => {
    setTitlesData((prev) => incrementTitles(prev, "dodgeCount", 1));
  }, []);

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
        incrementBlockCounter,
        incrementDamageTaken,
        incrementDamageDealt,
        incrementDodgeCounter,
        handleDefeat,
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

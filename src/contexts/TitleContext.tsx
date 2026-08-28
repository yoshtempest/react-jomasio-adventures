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
import type {
  TitlesData,
  TitleBonusMap,
  TitleDef,
  TitleProgress,
} from "@/utils/types/player/titles";
import { TITLES, TITLE_IDS, getTitleById, type TitleId } from "@/data/titles";
import { loadData, saveData } from "@/utils/titles/storage";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import type { ElementType } from "@/utils/types/battle/element";

const ELEMENT_LEVEL_BONUS = [0, 1, 2, 3, 5, 10] as const;

type ContextType = {
  titlesData: TitlesData;
  getBonus: () => TitleBonusMap;
  getElementDamageBonus: (npcElementTypes: readonly ElementType[]) => number;
  getPetDropBonus: () => number;
  getAlfaSpawnBonus: () => number;
  incrementKillCounter: (npcType: string, npcClass: string) => void;
  incrementBlockCounter: () => void;
  incrementDamageTaken: (amount: number) => void;
  incrementDamageDealt: (amount: number) => void;
  incrementDodgeCounter: () => void;
  incrementPetDropCounter: () => void;
  incrementAlfaKillCounter: () => void;
  handleDefeat: () => void;
  equipTitle: (id: TitleId) => void;
  unequipTitle: () => void;
};

const TitleContext = createContext<ContextType | null>(null);

const DEFAULT_TITLE_PROGRESS: TitleProgress = { current: 0, level: 0 };

function incrementTitles(
  prev: TitlesData,
  conditionType: string,
  amount: number,
  matchFn?: (def: TitleDef) => boolean,
): TitlesData {
  const nextProgress = { ...prev.progress };
  let changed = false;

  for (const titleId of TITLE_IDS) {
    const def = TITLES[titleId];
    if (def.condition.type !== conditionType) continue;
    if (matchFn && !matchFn(def)) continue;

    const prog = nextProgress[titleId] ?? DEFAULT_TITLE_PROGRESS;
    if (prog.level >= def.levels.length) continue;

    const nextCurrent = prog.current + amount;
    const nextLevelTarget = def.levels[prog.level]?.count ?? Infinity;
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
    for (const id of TITLE_IDS) {
      const prevLevel = prev[id]?.level ?? 0;
      const currLevel = curr[id]?.level ?? 0;
      if (currLevel > prevLevel) {
        playSound("unlockedTitle");
        break;
      }
    }
    prevProgressRef.current = curr;
  }, [titlesData.progress, playSound]);

  /**
   * Bônus agregados por condição, pré-calculados quando o progresso muda.
   * Antes, cada getter percorria todos os títulos a cada chamada (em
   * batalha, por hit).
   */
  const bonusMaps = useMemo(() => {
    const byElement = new Map<ElementType, number>();
    let petDrop = 0;
    let alfaSpawn = 0;
    for (const titleId of TITLE_IDS) {
      const def = TITLES[titleId];
      const prog = titlesData.progress[titleId];
      if (!prog || prog.level === 0) continue;
      const levelBonus = ELEMENT_LEVEL_BONUS[prog.level] ?? 0;
      if (def.condition.type === "killElement") {
        const current = byElement.get(def.condition.element) ?? 0;
        byElement.set(def.condition.element, current + levelBonus);
      } else if (def.condition.type === "petDrop") {
        petDrop += levelBonus;
      } else if (def.condition.type === "killAlfa") {
        alfaSpawn += levelBonus;
      }
    }
    return { byElement, petDrop, alfaSpawn };
  }, [titlesData.progress]);

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

    const titleProgress = titlesData.progress[titlesData.equippedId];
    if (!titleProgress || titleProgress.level === 0) return bonus;

    const levelIndex = titleProgress.level - 1;
    const levelDef = title.levels[levelIndex];
    if (!levelDef) return bonus;

    for (const b of levelDef.bonus) {
      if (b.stat in bonus) {
        bonus[b.stat] += b.value;
      }
    }

    return bonus;
  }, [titlesData.equippedId, titlesData.progress]);

  const getElementDamageBonus = useCallback(
    (npcElementTypes: readonly ElementType[]): number => {
      let totalBonus = 0;
      for (const element of npcElementTypes) {
        totalBonus += bonusMaps.byElement.get(element) ?? 0;
      }
      return 1 + totalBonus / 100;
    },
    [bonusMaps],
  );

  const getPetDropBonus = useCallback((): number => {
    return 1 + bonusMaps.petDrop / 100;
  }, [bonusMaps]);

  const getAlfaSpawnBonus = useCallback((): number => {
    return 1 + bonusMaps.alfaSpawn / 100;
  }, [bonusMaps]);

  const incrementKillCounter = useCallback(
    (npcType: string, npcClass: string) => {
      setTitlesData((prev) => {
        const nextProgress = { ...prev.progress };
        let changed = false;

        const elements = getNpcElementTypes(npcType);

        for (const titleId of TITLE_IDS) {
          const def = TITLES[titleId];
          const prog = nextProgress[titleId] ?? DEFAULT_TITLE_PROGRESS;
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
          } else if (def.condition.type === "killElement") {
            if (elements.includes(def.condition.element)) {
              shouldIncrement = true;
            }
          }

          if (shouldIncrement && prog.level < def.levels.length) {
            const nextCurrent = prog.current + 1;
            const nextLevelTarget = def.levels[prog.level]?.count ?? Infinity;
            const nextLevel =
              nextCurrent >= nextLevelTarget ? prog.level + 1 : prog.level;
            nextProgress[titleId] = {
              current: nextCurrent,
              level: nextLevel,
            };
            changed = true;
          }
        }

        const allElementsCount = new Set<ElementType>();
        for (const titleId of TITLE_IDS) {
          const def = TITLES[titleId];
          if (
            def.condition.type === "killElement" &&
            (nextProgress[titleId]?.current ?? 0) > 0
          ) {
            allElementsCount.add(def.condition.element);
          }
        }
        for (const titleId of TITLE_IDS) {
          const def = TITLES[titleId];
          if (def.condition.type !== "killAllElements") continue;
          const prog = nextProgress[titleId] ?? DEFAULT_TITLE_PROGRESS;
          if (prog.level >= def.levels.length) continue;
          const nextCurrent = allElementsCount.size;
          const nextLevelTarget = def.levels[prog.level]?.count ?? Infinity;
          const nextLevel =
            nextCurrent >= nextLevelTarget ? prog.level + 1 : prog.level;
          if (nextCurrent !== prog.current || nextLevel !== prog.level) {
            nextProgress[titleId] = { current: nextCurrent, level: nextLevel };
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

      for (const titleId of TITLE_IDS) {
        const def = TITLES[titleId];
        if (def.condition.type !== "consecutiveWins") continue;

        const prog = nextProgress[titleId] ?? DEFAULT_TITLE_PROGRESS;
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

  const incrementPetDropCounter = useCallback(() => {
    setTitlesData((prev) => incrementTitles(prev, "petDrop", 1));
  }, []);

  const incrementAlfaKillCounter = useCallback(() => {
    setTitlesData((prev) => incrementTitles(prev, "killAlfa", 1));
  }, []);

  const equipTitle = useCallback((id: TitleId) => {
    setTitlesData((prev) => {
      if ((prev.progress[id]?.level ?? 0) === 0) return prev;
      return { ...prev, equippedId: prev.equippedId === id ? null : id };
    });
  }, []);

  const unequipTitle = useCallback(() => {
    setTitlesData((prev) => ({ ...prev, equippedId: null }));
  }, []);

  const value = useMemo(
    () => ({
      titlesData,
      getBonus,
      getElementDamageBonus,
      getPetDropBonus,
      getAlfaSpawnBonus,
      incrementKillCounter,
      incrementBlockCounter,
      incrementDamageTaken,
      incrementDamageDealt,
      incrementDodgeCounter,
      incrementPetDropCounter,
      incrementAlfaKillCounter,
      handleDefeat,
      equipTitle,
      unequipTitle,
    }),
    [
      titlesData,
      getBonus,
      getElementDamageBonus,
      getPetDropBonus,
      getAlfaSpawnBonus,
      incrementKillCounter,
      incrementBlockCounter,
      incrementDamageTaken,
      incrementDamageDealt,
      incrementDodgeCounter,
      incrementPetDropCounter,
      incrementAlfaKillCounter,
      handleDefeat,
      equipTitle,
      unequipTitle,
    ],
  );

  return (
    <TitleContext.Provider value={value}>{children}</TitleContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTitles() {
  const ctx = useContext(TitleContext);
  if (!ctx) throw new Error("useTitles precisa do TitleProvider");
  return ctx;
}

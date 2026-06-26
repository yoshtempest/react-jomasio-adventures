import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Character } from "@/utils/types/player/player";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { saveCompressed, loadCompressed } from "@/utils/storage";
import { CHARACTER_PROGRESS_KEY } from "@/data/storageKeys";
import type {
  CharacterStats,
  CharactersProgress,
} from "@/data/characters/defaultProgress";
import { defaultProgress } from "@/data/characters/defaultProgress";
import { normalizeProgress, getXPToNextLevel } from "@/utils/character/progress";

type ContextType = {
  progress: CharactersProgress;
  addXP: (character: Character, amount: number) => void;
  addStat: (
    character: Character,
    stat: keyof Omit<CharacterStats, "points">,
  ) => void;
  incrementKills: (character: Character) => void;
  getXPToNextLevel: (level: number) => number;
};

const CharacterProgressContext = createContext({} as ContextType);
const STORAGE_KEY = CHARACTER_PROGRESS_KEY;

export function CharacterProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [progress, setProgress] = useState<CharactersProgress>(() => {
    const saved = loadCompressed<CharactersProgress>(STORAGE_KEY);

    if (!saved) return defaultProgress;

    try {
      return normalizeProgress(saved);
    } catch {
      return defaultProgress;
    }
  });

  // 💾 salvar
  useEffect(() => {
    saveCompressed(STORAGE_KEY, progress);
  }, [progress]);
  const { playSound } = useSoundEffects();

  // ⭐ XP + LEVEL + POINTS
  function addXP(character: Character, amount: number) {
    setProgress((prev) => {
      const char = prev[character];

      let newXP = char.xp + amount;
      let newLevel = char.level;
      let pointsGained = 0;

      let xpNeeded = getXPToNextLevel(newLevel);

      while (newXP >= xpNeeded) {
        newXP -= xpNeeded;
        newLevel++;
        pointsGained++;
        playSound("levelUp");
        xpNeeded = getXPToNextLevel(newLevel);
      }

      return {
        ...prev,
        [character]: {
          level: newLevel,
          xp: newXP,
          stats: {
            ...char.stats,
            points: char.stats.points + pointsGained,
          },
        },
      };
    });
  }

  // 💀 INCREMENTAR KILLS
  function incrementKills(character: Character) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: {
          ...char,
          kills: char.kills + 1,
        },
      };
    });
  }

  // ➕ DISTRIBUIR PONTOS
  function addStat(
    character: Character,
    stat: keyof Omit<CharacterStats, "points">,
  ) {
    setProgress((prev) => {
      const char = prev[character];

      if (char.stats.points <= 0) return prev;

      return {
        ...prev,
        [character]: {
          ...char,
          stats: {
            ...char.stats,
            [stat]: (char.stats[stat] || 0) + 1,
            points: char.stats.points - 1,
          },
        },
      };
    });
  }

  return (
    <CharacterProgressContext.Provider
      value={{ progress, addXP, addStat, incrementKills, getXPToNextLevel }}
    >
      {children}
    </CharacterProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCharacterProgress() {
  return useContext(CharacterProgressContext);
}

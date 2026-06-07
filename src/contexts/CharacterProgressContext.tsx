import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Character } from "@/utils/types/player/player";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export type CharacterStats = {
  hp: number;
  strength: number;
  intelligence: number;
  points: number;
};

export type CharacterProgress = {
  level: number;
  xp: number;
  stats: CharacterStats;
};

type CharactersProgress = Record<Character, CharacterProgress>;

type ContextType = {
  progress: CharactersProgress;
  addXP: (character: Character, amount: number) => void;
  addStat: (character: Character, stat: keyof Omit<CharacterStats, "points">) => void;
  getXPToNextLevel: (level: number) => number;
};

const CharacterProgressContext = createContext({} as ContextType);
const STORAGE_KEY = "characters_progress";

const defaultProgress: CharactersProgress = {
  marcelo: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  eduarda: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  lucas: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  samuel: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  artur: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  mayra: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  lucaua: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  riquelme: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  hiago: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  larissa: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  camilly: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
  emanuel: { level: 1, xp: 0, stats: { hp: 1, strength: 1, intelligence: 1, points: 0 } },
};

function getXPToNextLevel(level: number) {
  if (level <= 10) return level * 10;
  return level * 10 + 90;
}

// 🔥 NORMALIZAÇÃO (ESSENCIAL)
function normalizeProgress(data: any): CharactersProgress {
  const safe: CharactersProgress = { ...defaultProgress };

  for (const key in safe) {
    const savedChar = data?.[key];

    safe[key as Character] = {
      level: savedChar?.level ?? 1,
      xp: savedChar?.xp ?? 0,
      stats: {
        hp: savedChar?.stats?.hp ?? 1,
        strength: savedChar?.stats?.strength ?? 1,
        intelligence: savedChar?.stats?.intelligence ?? 1,
        points: savedChar?.stats?.points ?? 0,
      },
    };
  }
  return safe;
}


export function CharacterProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<CharactersProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultProgress;

    try {
      const parsed = JSON.parse(saved);
      return normalizeProgress(parsed);
    } catch {
      return defaultProgress;
    }
  });

  // 💾 salvar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

  // ➕ DISTRIBUIR PONTOS
  function addStat(character: Character, stat: "hp" | "strength" | "intelligence") {
    setProgress((prev) => {
      const char = prev[character];

      if (char.stats.points <= 0) return prev;

      return {
        ...prev,
        [character]: {
          ...char,
          stats: {
            ...char.stats,
            [stat]: char.stats[stat] + 1,
            points: char.stats.points - 1,
          },
        },
      };
    });
  }

  return (
    <CharacterProgressContext.Provider
      value={{ progress, addXP, addStat, getXPToNextLevel }}
    >
      {children}
    </CharacterProgressContext.Provider>
  );
}

export function useCharacterProgress() {
  return useContext(CharacterProgressContext);
}
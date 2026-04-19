import { createContext, useContext, useEffect, useState } from "react";
import type { Character } from "@/utils/types/player";

type CharacterProgress = {
  level: number;
  xp: number;
};

type CharactersProgress = Record<Character, CharacterProgress>;

type ContextType = {
  progress: CharactersProgress;
  addXP: (character: Character, amount: number) => void;
  getXPToNextLevel: (level: number) => number;
};

const CharacterProgressContext = createContext({} as ContextType);

const STORAGE_KEY = "characters_progress";

// 🧮 fórmula
function getXPToNextLevel(level: number) {
  if (level <= 10) return level * 10;
  return level * 10 + 90;
}

export function CharacterProgressProvider({ children }: any) {
  const [progress, setProgress] = useState<CharactersProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    // inicializa todos no level 1
    const initial: CharactersProgress = {
      marcelo: { level: 1, xp: 0 },
      eduarda: { level: 1, xp: 0 },
      lucas: { level: 1, xp: 0 },
      samuel: { level: 1, xp: 0 },
      artur: { level: 1, xp: 0 },
      mayra: { level: 1, xp: 0 },
      lucaua: { level: 1, xp: 0 },
      riquelme: { level: 1, xp: 0 },
      hiago: { level: 1, xp: 0 },
      larissa: { level: 1, xp: 0 },
      camilly: { level: 1, xp: 0 },
      emanuel: { level: 1, xp: 0 },
    };

    return initial;
  });

  // salva no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function addXP(character: Character, amount: number) {
    setProgress((prev) => {
      const char = prev[character];

      let newXP = char.xp + amount;
      let newLevel = char.level;

      let xpNeeded = getXPToNextLevel(newLevel);

      // 🔥 loop de level up
      while (newXP >= xpNeeded) {
        newXP -= xpNeeded;
        newLevel++;
        xpNeeded = getXPToNextLevel(newLevel);
      }

      return {
        ...prev,
        [character]: {
          level: newLevel,
          xp: newXP,
        },
      };
    });
  }

  return (
    <CharacterProgressContext.Provider
      value={{ progress, addXP, getXPToNextLevel }}
    >
      {children}
    </CharacterProgressContext.Provider>
  );
}

export function useCharacterProgress() {
  return useContext(CharacterProgressContext);
}
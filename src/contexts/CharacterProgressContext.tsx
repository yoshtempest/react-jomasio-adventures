import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Character } from "@/utils/types/player/player";
import { useSoundEffects, type SoundId } from "@/contexts/SoundEffectsContext";
import { CHARACTER_PROGRESS_KEY } from "@/data/storageKeys";
import type {
  CharacterStats,
  CharactersProgress,
} from "@/data/characters/defaultProgress";
import { defaultProgress } from "@/data/characters/defaultProgress";
import {
  normalizeProgress,
  getXPToNextLevel,
} from "@/utils/character/progress";
import { getXpBuffMultiplier } from "@/utils/buffs/xpBuff";
import { useCompressedStorage } from "@/hooks/useCompressedStorage";

export const MAX_HUNGER = 100;

// eslint-disable-next-line react-refresh/only-export-components
export function getHungerMultiplier(hunger: number): number {
  const clamped = Math.max(0, Math.min(MAX_HUNGER, hunger));
  return 0.5 + clamped / (MAX_HUNGER * 2);
}

type ContextType = {
  progress: CharactersProgress;
  addXP: (character: Character, amount: number) => void;
  addCoins: (character: Character, amount: number) => void;
  addHyperCoins: (character: Character, amount: number) => void;
  addStat: (
    character: Character,
    stat: keyof Omit<CharacterStats, "points">,
  ) => void;
  incrementKills: (character: Character) => void;
  reduceHunger: (character: Character, amount: number) => void;
  restoreHunger: (character: Character, amount: number) => void;
  resetHunger: (character: Character) => void;
  setHunger: (character: Character, value: number) => void;
  setBattleHP: (character: Character, hp: number | null) => void;
  getXPToNextLevel: (level: number) => number;
};

const CharacterProgressContext = createContext({} as ContextType);
const STORAGE_KEY = CHARACTER_PROGRESS_KEY;

export function CharacterProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [progress, setProgress] = useCompressedStorage(
    STORAGE_KEY,
    defaultProgress,
    normalizeProgress,
  );
  const { playSound } = useSoundEffects();

  const pendingSoundsRef = useRef<SoundId[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach((s) => playSound(s));
  }, [progress, playSound]);

  // ⭐ XP + LEVEL + POINTS
  function addXP(character: Character, amount: number) {
    const isSunday = new Date().getDay() === 0;
    const xpBuff = getXpBuffMultiplier();
    const finalAmount = Math.floor(amount * (isSunday ? 2 : 1) * xpBuff);

    setProgress((prev) => {
      pendingSoundsRef.current = [];

      const char = prev[character];

      let newXP = char.xp + finalAmount;
      let newLevel = char.level;
      let pointsGained = 0;

      let xpNeeded = getXPToNextLevel(newLevel);

      let newHunger = char.hunger;

      while (newXP >= xpNeeded) {
        newXP -= xpNeeded;
        newLevel++;
        pointsGained++;
        newHunger = MAX_HUNGER; // level up → hunger reset to 100%
        pendingSoundsRef.current.push("levelUp");
        xpNeeded = getXPToNextLevel(newLevel);
      }

      return {
        ...prev,
        [character]: {
          ...char,
          level: newLevel,
          xp: newXP,
          hunger: newHunger,
          battleHP: pointsGained > 0 ? null : char.battleHP,
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
          kills: (char.kills ?? 0) + 1,
        },
      };
    });
  }

  // 🪙 MOEDAS
  function addCoins(character: Character, amount: number) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: {
          ...char,
          coins: (char.coins ?? 0) + amount,
        },
      };
    });
  }

  function addHyperCoins(character: Character, amount: number) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: {
          ...char,
          hyperCoins: (char.hyperCoins ?? 0) + amount,
        },
      };
    });
  }

  // 🍽️ FOME
  function reduceHunger(character: Character, amount: number) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: {
          ...char,
          hunger: Math.max(0, char.hunger - amount),
        },
      };
    });
  }

  function restoreHunger(character: Character, amount: number) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: {
          ...char,
          hunger: Math.min(MAX_HUNGER, char.hunger + amount),
        },
      };
    });
  }

  function resetHunger(character: Character) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: { ...char, hunger: MAX_HUNGER },
      };
    });
  }

  function setHunger(character: Character, value: number) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: {
          ...char,
          hunger: Math.max(0, Math.min(MAX_HUNGER, value)),
        },
      };
    });
  }

  function setBattleHP(character: Character, hp: number | null) {
    setProgress((prev) => {
      const char = prev[character];
      return {
        ...prev,
        [character]: { ...char, battleHP: hp },
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
      value={{
        progress,
        addXP,
        addCoins,
        addHyperCoins,
        addStat,
        incrementKills,
        reduceHunger,
        restoreHunger,
        resetHunger,
        setHunger,
        setBattleHP,
        getXPToNextLevel,
      }}
    >
      {children}
    </CharacterProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCharacterProgress() {
  return useContext(CharacterProgressContext);
}

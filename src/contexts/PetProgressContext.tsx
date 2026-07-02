import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { saveCompressed, loadCompressed } from "@/utils/save/storage";
import { PET_PROGRESS_KEY } from "@/data/storageKeys";
import { slotKey } from "@/utils/save/slotManager";
import type { PetsProgress } from "@/data/characters/petProgress";
import {
  PET_DEFAULT_PROGRESS,
  normalizePetProgress,
} from "@/data/characters/petProgress";
import {
  getPetXPToNextLevel,
  getPetClass,
} from "@/utils/character/petProgress";

type ContextType = {
  petProgress: PetsProgress;
  getPetProgress: (petId: string) => { level: number; xp: number };
  addPetXP: (petId: string, amount: number) => void;
};

const PetProgressContext = createContext({} as ContextType);
const STORAGE_KEY = PET_PROGRESS_KEY;

export function PetProgressProvider({ children }: { children: ReactNode }) {
  const [petProgress, setPetProgress] = useState<PetsProgress>(() => {
    const saved = loadCompressed<PetsProgress>(slotKey(STORAGE_KEY));
    if (!saved) return {};
    try {
      return normalizePetProgress(saved);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    saveCompressed(slotKey(STORAGE_KEY), petProgress);
  }, [petProgress]);

  const { playSound } = useSoundEffects();

  function getPetProgress(petId: string) {
    return petProgress[petId] ?? PET_DEFAULT_PROGRESS;
  }

  function addPetXP(petId: string, amount: number) {
    if (amount <= 0) return;

    setPetProgress((prev) => {
      const current = prev[petId] ?? PET_DEFAULT_PROGRESS;
      const petClass = getPetClass(petId);

      let newXP = current.xp + amount;
      let newLevel = current.level;

      while (newLevel < 100) {
        const xpNeeded = getPetXPToNextLevel(newLevel, petClass);
        if (newXP < xpNeeded) break;
        newXP -= xpNeeded;
        newLevel++;
        playSound("levelUp");
      }

      if (newLevel >= 100) newXP = 0;

      return {
        ...prev,
        [petId]: { level: newLevel, xp: newXP },
      };
    });
  }

  return (
    <PetProgressContext.Provider
      value={{ petProgress, getPetProgress, addPetXP }}
    >
      {children}
    </PetProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePetProgress() {
  return useContext(PetProgressContext);
}

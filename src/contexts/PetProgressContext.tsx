import {
  createContext,
  useContext,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { useSoundEffects, type SoundId } from "@/contexts/SoundEffectsContext";
import { PET_PROGRESS_KEY } from "@/data/storageKeys";
import type { PetsProgress } from "@/data/characters/petProgress";
import {
  PET_DEFAULT_PROGRESS,
  normalizePetProgress,
} from "@/data/characters/petProgress";
import {
  getPetXPToNextLevel,
  getPetClass,
} from "@/utils/character/petProgress";
import { useCompressedStorage } from "@/hooks/useCompressedStorage";

type ContextType = {
  petProgress: PetsProgress;
  getPetProgress: (petId: string) => { level: number; xp: number };
  addPetXP: (petId: string, amount: number) => void;
};

const PetProgressContext = createContext({} as ContextType);
const STORAGE_KEY = PET_PROGRESS_KEY;

export function PetProgressProvider({ children }: { children: ReactNode }) {
  const [petProgress, setPetProgress] = useCompressedStorage(
    STORAGE_KEY,
    {} as PetsProgress,
    normalizePetProgress,
  );

  const { playSound } = useSoundEffects();

  const pendingSoundsRef = useRef<SoundId[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach((s) => playSound(s));
  }, [petProgress, playSound]);

  function getPetProgress(petId: string) {
    return petProgress[petId] ?? PET_DEFAULT_PROGRESS;
  }

  function addPetXP(petId: string, amount: number) {
    if (amount <= 0) return;

    setPetProgress((prev) => {
      pendingSoundsRef.current = [];

      const current = prev[petId] ?? PET_DEFAULT_PROGRESS;
      const petClass = getPetClass(petId);

      let newXP = current.xp + amount;
      let newLevel = current.level;

      while (newLevel < 100) {
        const xpNeeded = getPetXPToNextLevel(newLevel, petClass);
        if (newXP < xpNeeded) break;
        newXP -= xpNeeded;
        newLevel++;
        pendingSoundsRef.current.push("levelUp");
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

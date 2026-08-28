import {
  createContext,
  useContext,
  useCallback,
  useMemo,
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
import { PET_MAX_LEVEL } from "@/data/characters/petProgress";

type ContextType = {
  petProgress: PetsProgress;
  getPetProgress: (
    petId: string,
    stars?: number,
  ) => { level: number; xp: number };
  addPetXP: (petId: string, stars: number, amount: number) => void;
  resetPetProgress: (petId: string, stars: number) => void;
};

const PetProgressContext = createContext<ContextType | null>(null);
const STORAGE_KEY = PET_PROGRESS_KEY;

export function PetProgressProvider({ children }: { children: ReactNode }) {
  const [petProgress, setPetProgress] = useCompressedStorage(
    STORAGE_KEY,
    {},
    normalizePetProgress,
  );

  const { playSound } = useSoundEffects();

  const pendingSoundsRef = useRef<SoundId[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach((s) => playSound(s));
  }, [petProgress, playSound]);

  const getPetProgress = useCallback(
    (petId: string, stars: number = 1) => {
      return petProgress[petId]?.[stars] ?? PET_DEFAULT_PROGRESS;
    },
    [petProgress],
  );

  const addPetXP = useCallback(
    (petId: string, stars: number, amount: number) => {
      if (amount <= 0) return;

      setPetProgress((prev) => {
        pendingSoundsRef.current = [];

        const current = prev[petId]?.[stars] ?? PET_DEFAULT_PROGRESS;
        const petClass = getPetClass(petId);

        let newXP = current.xp + amount;
        let newLevel = current.level;

        while (newLevel < PET_MAX_LEVEL) {
          const xpNeeded = getPetXPToNextLevel(newLevel, petClass);
          if (newXP < xpNeeded) break;
          newXP -= xpNeeded;
          newLevel++;
          pendingSoundsRef.current.push("levelUp");
        }

        if (newLevel >= PET_MAX_LEVEL) newXP = 0;

        return {
          ...prev,
          [petId]: {
            ...prev[petId],
            [stars]: { level: newLevel, xp: newXP },
          },
        };
      });
    },
    [setPetProgress],
  );

  const resetPetProgress = useCallback(
    (petId: string, stars: number) => {
      setPetProgress((prev) => {
        const byStar = { ...prev[petId] };
        delete byStar[stars];
        return { ...prev, [petId]: byStar };
      });
    },
    [setPetProgress],
  );

  const value = useMemo(
    () => ({
      petProgress,
      getPetProgress,
      addPetXP,
      resetPetProgress,
    }),
    [petProgress, getPetProgress, addPetXP, resetPetProgress],
  );

  return (
    <PetProgressContext.Provider value={value}>
      {children}
    </PetProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePetProgress() {
  const ctx = useContext(PetProgressContext);
  if (!ctx) throw new Error("usePetProgress precisa do PetProgressProvider");
  return ctx;
}
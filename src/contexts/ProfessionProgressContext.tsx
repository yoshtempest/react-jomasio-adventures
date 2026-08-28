import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Character } from "@/utils/types/player/player";
import type {
  CharactersProficiencies,
  CharacterProficiencies,
  ProfessionId,
  ProfessionProficiency,
} from "@/utils/types/player/profession";
import { CHARACTERS } from "@/data/characters/list";
import { PROFESSION_PROGRESS_KEY } from "@/data/storageKeys";
import { useCompressedStorage } from "@/hooks/useCompressedStorage";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import {
  applyProficiencyXP,
  getProfessionXPToNextLevel,
  DEFAULT_PROFESSION_PROFICIENCY,
} from "@/gameRules/professions/proficiency";

type ContextType = {
  proficiency: CharactersProficiencies;
  getProficiency: (
    character: Character,
    professionId: ProfessionId,
  ) => ProfessionProficiency;
  getXPToNextProfessionLevel: (level: number) => number;
  addProficiencyXP: (
    character: Character,
    professionId: ProfessionId,
    amount: number,
  ) => void;
};

const ProfessionProgressContext = createContext<ContextType | null>(null);

const STORAGE_KEY = PROFESSION_PROGRESS_KEY;

function createDefaultProficiencies(): CharactersProficiencies {
  const proficiencies = {} as CharactersProficiencies;
  for (const char of CHARACTERS) {
    proficiencies[char] = {};
  }
  return proficiencies;
}

function normalizeProficiencies(data: unknown): CharactersProficiencies {
  const safe = createDefaultProficiencies();
  const raw = data as Partial<CharactersProficiencies> | undefined;

  for (const char of CHARACTERS) {
    const savedChar = raw?.[char];
    if (!savedChar) continue;

    const charProficiencies: CharacterProficiencies = {};

    for (const [professionId, value] of Object.entries(savedChar)) {
      if (!value || typeof value !== "object") continue;
      const level = typeof value.level === "number" ? value.level : 1;
      const xp = typeof value.xp === "number" ? value.xp : 0;
      charProficiencies[professionId as ProfessionId] = {
        level: Math.max(1, level),
        xp: Math.max(0, xp),
      };
    }

    safe[char] = charProficiencies;
  }

  return safe;
}

export function ProfessionProgressProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [proficiency, setProficiency] = useCompressedStorage(
    STORAGE_KEY,
    createDefaultProficiencies(),
    normalizeProficiencies,
  );
  const { playSound } = useSoundEffects();

  const pendingSoundsRef = useRef<"levelUp"[]>([]);

  useEffect(() => {
    const sounds = pendingSoundsRef.current.splice(0);
    sounds.forEach(() => playSound("levelUp"));
  }, [proficiency, playSound]);

  const getProficiency = useCallback(
    (
      character: Character,
      professionId: ProfessionId,
    ): ProfessionProficiency => {
      return (
        proficiency[character]?.[professionId] ?? DEFAULT_PROFESSION_PROFICIENCY
      );
    },
    [proficiency],
  );

  const addProficiencyXP = useCallback(
    (character: Character, professionId: ProfessionId, amount: number) => {
      setProficiency((prev) => {
        pendingSoundsRef.current = [];

        const current = prev[character]?.[professionId];
        const { proficiency: updated, leveledUp } = applyProficiencyXP(
          current,
          amount,
        );

        if (leveledUp) pendingSoundsRef.current.push("levelUp");

        return {
          ...prev,
          [character]: {
            ...prev[character],
            [professionId]: updated,
          },
        };
      });
    },
    [setProficiency],
  );

  const value = useMemo(
    () => ({
      proficiency,
      getProficiency,
      getXPToNextProfessionLevel: getProfessionXPToNextLevel,
      addProficiencyXP,
    }),
    [proficiency, getProficiency, addProficiencyXP],
  );

  return (
    <ProfessionProgressContext.Provider value={value}>
      {children}
    </ProfessionProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfessionProgress() {
  const ctx = useContext(ProfessionProgressContext);
  if (!ctx)
    throw new Error(
      "useProfessionProgress precisa do ProfessionProgressProvider",
    );
  return ctx;
}

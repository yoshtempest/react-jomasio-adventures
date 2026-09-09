import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { getMaxMana } from "@/gameRules/battle/mana";

export type BattleManaApi = {
  playerMana: number;
  playerMaxMana: number;
  restoreMana: (amount: number) => void;
  consumeMana: (amount: number) => boolean;
  resetMana: () => void;
};

type BattleManaContextType = {
  api: BattleManaApi | null;
};

const BattleManaContext = createContext<BattleManaContextType>({ api: null });

export function BattleManaProvider({ children }: { children: ReactNode }) {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const { equipmentRevision } = useEquipment();

  const maxMana = useMemo(
    () => getMaxMana(player.character),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player.character, equipmentRevision],
  );

  const [playerMana, setPlayerManaState] = useState(() => {
    const saved = progress[player.character]?.battleMana;
    return saved != null && saved > 0 ? Math.min(saved, maxMana) : maxMana;
  });

  const manaRef = useLatestRef(playerMana);
  const maxManaRef = useLatestRef(maxMana);

  useEffect(() => {
    setPlayerManaState((current) => Math.min(current, maxMana));
  }, [maxMana]);

  const restoreMana = useCallback(
    (amount: number) => {
      setPlayerManaState((current) =>
        Math.min(maxManaRef.current, current + amount),
      );
    },
    [maxManaRef],
  );

  const consumeMana = useCallback(
    (amount: number) => {
      if (manaRef.current < amount) return false;
      setPlayerManaState((current) => Math.max(0, current - amount));
      return true;
    },
    [manaRef],
  );

  const resetMana = useCallback(() => {
    setPlayerManaState(maxManaRef.current);
  }, [maxManaRef]);

  const value = useMemo<BattleManaContextType>(
    () => ({
      api: {
        playerMana,
        playerMaxMana: maxMana,
        restoreMana,
        consumeMana,
        resetMana,
      },
    }),
    [playerMana, maxMana, restoreMana, consumeMana, resetMana],
  );

  return (
    <BattleManaContext.Provider value={value}>
      {children}
    </BattleManaContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBattleMana(): BattleManaApi | null {
  return useContext(BattleManaContext).api;
}

import type { Player } from "@/utils/types/player";

export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
) {
  const STEP = 50;

  function moveLeftBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        x: Math.max(0, p.x - STEP),
        battleDirection: "left",
        state: "walk",
      };
    });

    resetToIdle(300);
  }

  function moveRightBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        x: Math.min(900, p.x + STEP),
        battleDirection: "right",
        state: "walk",
      };
    });

    resetToIdle(150);
  }

  function punch() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;
      return { ...p, state: "punch" };
    });

    resetToIdle(150);
  }

  function resetToIdle(delay = 0) {
    setTimeout(() => {
      setPlayer((p) => ({
        ...p,
        state: "idle",
      }));
    }, delay);
  }

  return {
    moveLeftBattle,
    moveRightBattle,
    punch,
  };
}
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

  function moveUpBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        state: "jump",
        y: p.y - 80, // sobe
      };
    });

    // volta pro chão
    setTimeout(() => {
      setPlayer((p) => ({
        ...p,
        y: p.y + 80,
        state: "idle",
      }));
    }, 200);
  }

  function moveDownBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        state: "crouched",
        y: p.y + 40, // desce
      };
    });

    // sobe de volta
    setTimeout(() => {
      setPlayer((p) => ({
        ...p,
        y: p.y - 40,
        state: "idle",
      }));
    }, 200);
  }

  function punch() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;
      return { ...p, state: "punch" };
    });

    resetToIdle(150);
  }

  function special() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;
      return { ...p, state: "special" };
    });

    resetToIdle(800);
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
    moveUpBattle,
    moveLeftBattle,
    moveRightBattle,
    moveDownBattle,
    punch,
    special,
  };
}
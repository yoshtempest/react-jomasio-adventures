import { type Player } from "@/utils/types/player";

export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
) {
  function moveLeftBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        x: Math.max(0, p.x - 5),
        battleDirection: "left",
        state: "walk",
      };
    });
  }

  function moveRightBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        x: Math.min(900, p.x + 5),
        battleDirection: "right",
        state: "walk",
      };
    });
  }

  function punch() {
    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return { ...p, state: "punch" };
    });

    setTimeout(() => {
      setPlayer((p) => ({ ...p, state: "idle" }));
    }, 200);
  }

  return { moveLeftBattle, moveRightBattle, punch };
}
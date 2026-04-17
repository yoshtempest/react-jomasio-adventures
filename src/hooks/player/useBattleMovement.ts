import { useRef } from "react";
import type { Player } from "@/utils/types/player";

export function useBattleMovement(
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
) {
  const STEP = 50;

  const downLockRef = useRef(false);
    function isLocked(p: Player) {
    return p.mode === "battle" && p.state === "crouched";
  }

  function moveLeftBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle" || isLocked(p)) return p;

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
      if (p.mode !== "battle" || isLocked(p)) return p;

      return {
        ...p,
        x: Math.min(900, p.x + STEP),
        battleDirection: "right",
        state: "walk",
      };
    });

    resetToIdle(300);
  }

  function moveUpBattle() {
    setPlayer((p) => {
      if (p.mode !== "battle" || isLocked(p)) return p;

      return {
        ...p,
        state: "jump",
        y: p.y - 80,
      };
    });

    setTimeout(() => {
      setPlayer((p) => ({
        ...p,
        y: p.y + 80,
        state: "idle",
      }));
    }, 450);
  }

  // 👇 SEGURAR ↓
  function moveDownBattle() {
    if (downLockRef.current) return;

    downLockRef.current = true;

    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        state: "crouched",
        y: p.y + 40,
      };
    });
  }

  // 👇 SOLTAR ↓
  function releaseDownBattle() {
    if (!downLockRef.current) return;

    downLockRef.current = false;

    setPlayer((p) => {
      if (p.mode !== "battle") return p;

      return {
        ...p,
        state: "idle",
        y: p.y - 40,
      };
    });
  }

  function attack() {
    setPlayer((p) => {
      if (p.mode !== "battle" || isLocked(p)) return p;
      return { ...p, state: "attack" };
    });

    resetToIdle(250);
  }

  function special() {
    setPlayer((p) => {
      if (p.mode !== "battle" || isLocked(p)) return p;
      return { ...p, state: "special" };
    });

    resetToIdle(800);
  }

  function resetToIdle(delay = 0) {
    setTimeout(() => {
      setPlayer((p) => {
        // 🚫 NÃO sai do crouch automaticamente
        if (p.state === "crouched") return p;

        return {
          ...p,
          state: "idle",
        };
      });
    }, delay);
  }

  return {
    moveUpBattle,
    moveLeftBattle,
    moveRightBattle,
    moveDownBattle,
    releaseDownBattle, // 👈 NOVO
    attack,
    special,
  };
}

/* adaptar para essa parte abaixo, depois */

// import { useRef, useEffect } from "react";
// import type { Player } from "@/utils/types/player";

// export function useBattleMovement(
//   setPlayer: React.Dispatch<React.SetStateAction<Player>>
// ) {
//   const STEP = 50;

//   const leftIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const rightIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   const downLockRef = useRef(false);

//   function isLocked(p: Player) {
//     return p.mode === "battle" && p.state === "crouched";
//   }

//   // ✅ LIMPEZA AUTOMÁTICA (ESSENCIAL)
//   useEffect(() => {
//     return () => {
//       if (leftIntervalRef.current) clearInterval(leftIntervalRef.current);
//       if (rightIntervalRef.current) clearInterval(rightIntervalRef.current);
//     };
//   }, []);

//   // ========================
//   // ⬅️ MOVIMENTO CONTÍNUO
//   // ========================

//   function startMoveLeft() {
//     if (leftIntervalRef.current) return;

//     leftIntervalRef.current = setInterval(() => {
//       setPlayer((p) => {
//         if (p.mode !== "battle" || isLocked(p)) return p;

//         return {
//           ...p,
//           x: Math.max(0, p.x - STEP),
//           battleDirection: "left",
//           state: "walk",
//         };
//       });
//     }, 100);
//   }

//   function stopMoveLeft() {
//     if (leftIntervalRef.current) {
//       clearInterval(leftIntervalRef.current);
//       leftIntervalRef.current = null;
//     }

//     setIdleIfNotMoving();
//   }

//   function startMoveRight() {
//     if (rightIntervalRef.current) return;

//     rightIntervalRef.current = setInterval(() => {
//       setPlayer((p) => {
//         if (p.mode !== "battle" || isLocked(p)) return p;

//         return {
//           ...p,
//           x: Math.min(900, p.x + STEP),
//           battleDirection: "right",
//           state: "walk",
//         };
//       });
//     }, 100);
//   }

//   function stopMoveRight() {
//     if (rightIntervalRef.current) {
//       clearInterval(rightIntervalRef.current);
//       rightIntervalRef.current = null;
//     }

//     setIdleIfNotMoving();
//   }

//   // ✅ evita conflito entre esquerda/direita
//   function setIdleIfNotMoving() {
//     if (!leftIntervalRef.current && !rightIntervalRef.current) {
//       setPlayer((p) => {
//         if (p.state === "crouched") return p;

//         return {
//           ...p,
//           state: "idle",
//         };
//       });
//     }
//   }

//   // ========================
//   // ⬆️ PULO
//   // ========================

//   function moveUpBattle() {
//     setPlayer((p) => {
//       if (p.mode !== "battle" || isLocked(p)) return p;

//       return {
//         ...p,
//         state: "jump",
//         y: p.y - 80,
//       };
//     });

//     setTimeout(() => {
//       setPlayer((p) => ({
//         ...p,
//         y: p.y + 80,
//         state: "idle",
//       }));
//     }, 450);
//   }

//   // ========================
//   // ⬇️ AGACHAR (HOLD)
//   // ========================

//   function moveDownBattle() {
//     if (downLockRef.current) return;

//     downLockRef.current = true;

//     setPlayer((p) => {
//       if (p.mode !== "battle") return p;

//       return {
//         ...p,
//         state: "crouched",
//         y: p.y + 40,
//       };
//     });
//   }

//   function releaseDownBattle() {
//     if (!downLockRef.current) return;

//     downLockRef.current = false;

//     setPlayer((p) => {
//       if (p.mode !== "battle") return p;

//       return {
//         ...p,
//         state: "idle",
//         y: p.y - 40,
//       };
//     });
//   }

//   // ========================
//   // 👊 ATAQUES
//   // ========================

//   function attack() {
//     setPlayer((p) => {
//       if (p.mode !== "battle" || isLocked(p)) return p;
//       return { ...p, state: "attack" };
//     });

//     resetToIdle(250);
//   }

//   function special() {
//     setPlayer((p) => {
//       if (p.mode !== "battle" || isLocked(p)) return p;
//       return { ...p, state: "special" };
//     });

//     resetToIdle(800);
//   }

//   function resetToIdle(delay = 0) {
//     setTimeout(() => {
//       setPlayer((p) => {
//         if (p.state === "crouched") return p;

//         return {
//           ...p,
//           state: "idle",
//         };
//       });
//     }, delay);
//   }

//   return {
//     moveUpBattle,
//     startMoveLeft,
//     stopMoveLeft,
//     startMoveRight,
//     stopMoveRight,
//     moveDownBattle,
//     releaseDownBattle,
//     attack,
//     special,
//   };
// }
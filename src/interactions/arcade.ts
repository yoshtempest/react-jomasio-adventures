import { createInteractionMap } from "./builder";
import { arcadeSpecialEventDialogue } from "@/data/maps/arcade/specialEvent";
import type { KeyDeps, InventoryDeps, QuestDeps } from "@/utils/types/interaction";

type ArcadeDeps = KeyDeps & InventoryDeps & QuestDeps & {
  coins: number;
  addCoins: (amount: number) => void;
  setFlag: (flag: FlagId) => void;
};

const WINNING_COMBOS = ["101", "110", "011"];

export function createArcade(deps: ArcadeDeps) {
  return createInteractionMap({}, deps, {
    "5,4": ({ setPopup, coins, addCoins, setFlag }) => {
      if (coins < 50) {
        setPopup("Você precisa de 50 coins para jogar!");
        return;
      }

      addCoins(-50);
      setPopup("🎰 Girando...");

      setTimeout(() => {
        let tick = 0;
        const interval = setInterval(() => {
          const d1 = Math.floor(Math.random() * 10);
          const d2 = Math.floor(Math.random() * 10);
          const d3 = Math.floor(Math.random() * 10);
          setPopup(`🎰 [${d1}] [${d2}] [${d3}]`);
          tick++;

          if (tick >= 15) {
            clearInterval(interval);

            const f1 = Math.floor(Math.random() * 10);
            const f2 = Math.floor(Math.random() * 10);
            const f3 = Math.floor(Math.random() * 10);
            const result = `${f1}${f2}${f3}`;

            if (WINNING_COMBOS.includes(result)) {
              setFlag("yvelUnlocked");
              setPopup(
                `🎰 [${f1}] [${f2}] [${f3}] - JACKPOT! Yvel foi desbloqueado!`
              );
            } else {
              setPopup(`🎰 [${f1}] [${f2}] [${f3}] - Tente novamente!`);
            }
          }
        }, 150);
      }, 500);
    },
  });
}

export { arcadeSpecialEventDialogue };

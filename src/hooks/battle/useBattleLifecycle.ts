import { useEffect } from "react";
import { isDead } from "@/gameRules/battle/death";

type Props = {
  playerHP: number;
  npcHP: number;

  npcClass: string;
  npcPhase: number;

  setNpcPhase: (n: number) => void;
  setNpcHP: (n: number) => void;

  npcMaxHp: number;

  onPlayerDeath: () => void;
  onNpcDeath: () => void;

  isEnding: React.RefObject<boolean>;
  setNpcDying: (value: boolean) => void;
};

export function useBattleLifecycle({
  playerHP,
  npcHP,
  npcClass,
  npcPhase,
  setNpcPhase,
  setNpcHP,
  npcMaxHp,
  onPlayerDeath,
  onNpcDeath,
  isEnding,
  setNpcDying
}: Props) {
  useEffect(() => {
    const timeouts: number[] = [];
    if (isEnding.current) return;

    if (isDead(playerHP)) {
      isEnding.current = true;
      timeouts.push(window.setTimeout(() => {
        onPlayerDeath();
        isEnding.current = false;
      }, 500));
    }

    if (isDead(npcHP)) {
      if (npcClass === "boss" && npcPhase === 1) {
        setNpcPhase(2);
        setNpcHP(npcMaxHp);
        return;
      }

      isEnding.current = true;
      setNpcDying(true);
      timeouts.push(window.setTimeout(() => {
        onNpcDeath();
      }, 300));
    }
    return () => timeouts.forEach(clearTimeout);
  }, [playerHP, npcHP]);
}
import { useEffect, useRef } from "react";
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
  setNpcDying,
}: Props) {
  const onPlayerDeathRef = useRef(onPlayerDeath);
  onPlayerDeathRef.current = onPlayerDeath;
  const onNpcDeathRef = useRef(onNpcDeath);
  onNpcDeathRef.current = onNpcDeath;
  const npcClassRef = useRef(npcClass);
  npcClassRef.current = npcClass;
  const npcPhaseRef = useRef(npcPhase);
  npcPhaseRef.current = npcPhase;
  const npcMaxHpRef = useRef(npcMaxHp);
  npcMaxHpRef.current = npcMaxHp;

  useEffect(() => {
    const timeouts: number[] = [];
    if (isEnding.current) return;

    if (isDead(playerHP)) {
      isEnding.current = true;
      timeouts.push(
        window.setTimeout(() => {
          onPlayerDeathRef.current();
          isEnding.current = false;
        }, 500),
      );
    }

    if (isDead(npcHP)) {
      if (npcClassRef.current === "boss" && npcPhaseRef.current === 1) {
        setNpcPhase(2);
        setNpcHP(npcMaxHpRef.current);
        return;
      }

      isEnding.current = true;
      setNpcDying(true);
      timeouts.push(
        window.setTimeout(() => {
          onNpcDeathRef.current();
        }, 300),
      );
    }
    return () => timeouts.forEach(clearTimeout);
  }, [playerHP, npcHP, setNpcPhase, setNpcHP, setNpcDying, isEnding]);
}

import { useEffect, useRef, useState } from "react";
import { isDead } from "@/gameRules/battle/death";

type Props = {
  playerHP: number;
  npcHP: number;

  npcClass: string;

  setNpcPhase: (n: number) => void;
  npcPhaseRef: React.RefObject<number>;
  setNpcHP: (n: number) => void;

  npcMaxHp: number;

  onPlayerDeath: () => void;
  onNpcDeath: () => void;

  isEnding: React.RefObject<boolean>;
};

export function useBattleLifecycle({
  playerHP,
  npcHP,
  npcClass,
  setNpcPhase,
  npcPhaseRef,
  setNpcHP,
  npcMaxHp,
  onPlayerDeath,
  onNpcDeath,
  isEnding,
}: Props) {
  const [isNpcDying, setNpcDying] = useState(false);

  const onPlayerDeathRef = useRef(onPlayerDeath);
  onPlayerDeathRef.current = onPlayerDeath;
  const onNpcDeathRef = useRef(onNpcDeath);
  onNpcDeathRef.current = onNpcDeath;
  const npcClassRef = useRef(npcClass);
  npcClassRef.current = npcClass;
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
        npcPhaseRef.current = 2; // atualiza ref sincronamente antes do render
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
  }, [playerHP, npcHP, setNpcPhase, setNpcHP, isEnding, npcPhaseRef]);

  return { isNpcDying };
}

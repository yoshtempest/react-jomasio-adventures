import { useEffect } from "react";
import type { RefObject } from "react";

type Props = {
  training: boolean | undefined;
  isPausedRef: RefObject<boolean>;
  npcMaxHp: number;
  setNpcHP: React.Dispatch<React.SetStateAction<number>>;
};

export function useTrainingEffects({
  training,
  isPausedRef,
  npcMaxHp,
  setNpcHP,
}: Props) {
  useEffect(() => {
    if (!training) return;
    const id = setInterval(() => {
      if (isPausedRef.current) return;
      setNpcHP((hp) => {
        const next = hp + npcMaxHp * 0.5;
        return next > npcMaxHp ? npcMaxHp : next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [training, npcMaxHp, setNpcHP, isPausedRef]);
}
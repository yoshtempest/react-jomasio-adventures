import { useState, useEffect, useRef } from "react";

export function useBattleHP(
  playerMaxHp: number,
  npcMaxHp: number,
  initialShield: number = 0,
  savedPlayerHP?: number | null,
) {
  const prevMaxHpRef = useRef(playerMaxHp);
  const [playerHP, setPlayerHP] = useState(() => {
    if (savedPlayerHP != null && savedPlayerHP > 0) {
      return Math.min(savedPlayerHP, playerMaxHp);
    }
    return playerMaxHp;
  });
  const [npcHP, setNpcHP] = useState(npcMaxHp);
  const [playerShield, setPlayerShield] = useState(initialShield);

  useEffect(() => {
    if (playerMaxHp > prevMaxHpRef.current) {
      const diff = playerMaxHp - prevMaxHpRef.current;
      setPlayerHP((hp) => Math.min(playerMaxHp, hp + diff));
    }
    prevMaxHpRef.current = playerMaxHp;
  }, [playerMaxHp]);

  useEffect(() => {
    setNpcHP(npcMaxHp);
  }, [npcMaxHp]);

  useEffect(() => {
    setPlayerShield(initialShield);
  }, [initialShield]);

  return {
    playerHP,
    setPlayerHP,
    npcHP,
    setNpcHP,
    playerShield,
    setPlayerShield,
  };
}

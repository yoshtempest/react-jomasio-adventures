import { useState, useEffect } from "react";

export function useBattleHP(
  playerMaxHp: number,
  npcMaxHp: number,
  initialShield: number = 0,
  savedPlayerHP?: number | null,
) {
  const [playerHP, setPlayerHP] = useState(() => {
    if (savedPlayerHP != null && savedPlayerHP > 0) {
      return Math.min(savedPlayerHP, playerMaxHp);
    }
    return playerMaxHp;
  });
  const [npcHP, setNpcHP] = useState(npcMaxHp);
  const [playerShield, setPlayerShield] = useState(initialShield);

  useEffect(() => {
    setPlayerHP(playerMaxHp);
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

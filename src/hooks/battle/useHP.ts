import { useState, useEffect } from "react";

export function useBattleHP(
  playerMaxHp: number,
  npcMaxHp: number,
  initialShield: number = 0,
) {
  const [playerHP, setPlayerHP] = useState(playerMaxHp);
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

import { useState, useEffect } from "react";

export function useBattleHP(playerMaxHp: number, npcMaxHp: number) {
  const [playerHP, setPlayerHP] = useState(playerMaxHp);
  const [npcHP, setNpcHP] = useState(npcMaxHp);

  useEffect(() => {
    setPlayerHP(playerMaxHp);
  }, [playerMaxHp]);

  useEffect(() => {
    setNpcHP(npcMaxHp);
  }, [npcMaxHp]);

  return { playerHP, setPlayerHP, npcHP, setNpcHP };
}

import { useState, useEffect, useRef } from "react";

export function useBattleHP(
  playerMaxHp: number,
  npcMaxHp: number,
  initialShield: number = 0,
  savedPlayerHP?: number | null,
  playerLevel?: number,
) {
  const prevMaxHpRef = useRef(playerMaxHp);
  const prevLevelRef = useRef(playerLevel);
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

  // Subir de nível cura para 100% — dentro de batalha o HP vive neste
  // state, então o `battleHP: null` gravado pelo addXP não chega aqui.
  useEffect(() => {
    const prevLevel = prevLevelRef.current;
    prevLevelRef.current = playerLevel;
    if (playerLevel == null || prevLevel == null) return;
    if (playerLevel <= prevLevel) return;
    setPlayerHP(playerMaxHp);
  }, [playerLevel, playerMaxHp]);

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

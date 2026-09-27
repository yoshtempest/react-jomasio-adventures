import { useState, useEffect, useRef } from "react";

export function useBattleHP(
  playerMaxHp: number,
  npcMaxHp: number,
  initialShield: number = 0,
  savedPlayerHP?: number | null,
  playerLevel?: number,
  playerCharacter?: CharacterId,
) {
  const prevMaxHpRef = useRef(playerMaxHp);
  // O nível anterior vem junto do personagem a que pertence: trocar de
  // personagem durante a batalha muda o número sem que ele tenha subido.
  const prevLevelRef = useRef<{ character?: CharacterId; level?: number }>({
    character: playerCharacter,
    level: playerLevel,
  });
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
    const prev = prevLevelRef.current;
    prevLevelRef.current = { character: playerCharacter, level: playerLevel };
    if (playerLevel == null || prev.level == null) return;
    if (playerCharacter !== prev.character) return;
    if (playerLevel <= prev.level) return;
    setPlayerHP(playerMaxHp);
  }, [playerLevel, playerCharacter, playerMaxHp]);

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

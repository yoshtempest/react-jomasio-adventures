import { useRef, useState, useCallback, useEffect } from "react";

type UseBattleSystemProps = {
  playerX: number;
  npcX: number;
  onPlayerDeath: () => void;
  onNpcDeath: () => void;
};

export function useBattleSystem({
  playerX,
  npcX,
  onPlayerDeath,
  onNpcDeath,
}: UseBattleSystemProps) {
  const [playerHP, setPlayerHP] = useState(100);
  const [npcHP, setNpcHP] = useState(100);

  const playerCooldown = useRef(true);
  const npcCooldown = useRef(true);
  const isEnding = useRef(false);

  function isInRange(range = 80) {
    return Math.abs(playerX - npcX) < range;
  }

  // 👊 PLAYER HIT
  const playerHit = useCallback(() => {
    if (!playerCooldown.current) return;

    playerCooldown.current = false;

    if (isInRange()) {
      setNpcHP((hp) => Math.max(0, hp - 10));
    }

    setTimeout(() => {
      playerCooldown.current = true;
    }, 400);
  }, [playerX, npcX]);

  // 🤖 NPC HIT
  const npcHit = useCallback(() => {
    if (!npcCooldown.current) return;

    if (isInRange(60)) {
      npcCooldown.current = false;

      setPlayerHP((hp) => Math.max(0, hp - 10));

      setTimeout(() => {
        npcCooldown.current = true;
      }, 800);
    }
  }, [playerX, npcX]);

  // 🧠 AUTO CHECK (MUITO MELHOR)
  useEffect(() => {
    if (isEnding.current) return;

    if (playerHP <= 0) {
      isEnding.current = true;

      setTimeout(() => {
        setPlayerHP(100);
        setNpcHP(100);
        isEnding.current = false;
        onPlayerDeath();
      }, 500);
      return;
    }

    if (npcHP <= 0) {
      isEnding.current = true;

      setTimeout(() => {
        onNpcDeath();
      }, 300);
    }
  }, [playerHP, npcHP, onPlayerDeath, onNpcDeath]);

  return {
    playerHP,
    npcHP,
    playerHit,
    npcHit,
  };
}
import { useRef, useState, useCallback, useEffect } from "react";

type UseBattleSystemProps = {
  playerX: number;
  playerY: number; // 👈 novo
  npcX: number;
  npcY: number;    // 👈 novo
  onPlayerDeath: () => void;
  onNpcDeath: () => void;
  playerState: string;
};

export function useBattleSystem({
  playerX,
  playerY, // 👈 novo
  npcX,
  npcY,    // 👈 novo
  playerState, // 👈 novo
  onPlayerDeath,
  onNpcDeath,
}: UseBattleSystemProps) {
  const [playerHP, setPlayerHP] = useState(100);
  const [npcHP, setNpcHP] = useState(100);

  const playerCooldown = useRef(true);
  const npcCooldown = useRef(true);
  const isEnding = useRef(false);

  const [delicia, setDelicia] = useState(0);
  const MAX_DELICIA = 6;

  function isInRange(rangeX = 80, rangeY = 50) {
    if (playerState === "jump" || playerState === "crouched") return false;
    const dx = Math.abs(playerX - npcX);
    const dy = Math.abs(playerY - npcY);
    return dx <= rangeX && dy <= rangeY;
    
  }

  // 👊 PLAYER HIT
  const playerHit = useCallback(() => {
    if (!playerCooldown.current) return;

    playerCooldown.current = false;

    if (isInRange()) {
      setNpcHP((hp) => Math.max(0, hp - 6));

      // 🔥 ganha delicia
      setDelicia((d) => Math.min(MAX_DELICIA, d + 1));
    }

    setTimeout(() => {
      playerCooldown.current = true;
    }, 400);
  }, [playerX, npcX]);

  const specialHit = useCallback(() => {
    if (!playerCooldown.current) return;
    if (delicia < MAX_DELICIA) return;

    playerCooldown.current = false;

    if (isInRange()) {
      setNpcHP((hp) => Math.max(0, hp - 15)); // 💥 3x dano
    }

    // 🔥 zera deliciômetro
    setDelicia(0);

    setTimeout(() => {
      playerCooldown.current = true;
    }, 600);
  }, [playerX, npcX, delicia]);

  // 🤖 NPC HIT
  const npcHit = useCallback(() => {
    if (!npcCooldown.current) return;

    if (isInRange(60, 50)) {
      npcCooldown.current = false;

      setPlayerHP((hp) => Math.max(0, hp - 10));

      setTimeout(() => {
        npcCooldown.current = true;
      }, 800);
    }
  }, [playerX, playerY, npcX, npcY]);

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
    delicia,
    
    playerHit,
    specialHit,
    npcHit,
  };
}
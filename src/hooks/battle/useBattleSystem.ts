import { useRef, useState, useCallback, useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { getNpcStats } from "@/utils/types/npcProgress";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";

type UseBattleSystemProps = {
  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;
  npcLevel: number;
  npcClass: "common" | "rare" | "boss";
  onPlayerDeath: () => void;
  onNpcDeath: () => void;
  playerState: string;
};

export function useBattleSystem({
  playerX,
  playerY,
  npcX,
  npcY,
  playerState,
  npcLevel,
  npcClass,
  onPlayerDeath,
  onNpcDeath,
}: UseBattleSystemProps) {
  const [playerHP, setPlayerHP] = useState(100);
  const [npcHP, setNpcHP] = useState(100);

  const { player } = usePlayer();
  const { progress } = useCharacterProgress();

  const playerCooldown = useRef(true);
  const npcCooldown = useRef(true);
  const isEnding = useRef(false);
  

  const [delicia, setDelicia] = useState(0);
  const MAX_DELICIA = 6;

  const resetBattle = useCallback(() => {
    setPlayerHP(100);
    setNpcHP(100);
    setDelicia(0);

    playerCooldown.current = true;
    npcCooldown.current = true;
    isEnding.current = false;
  }, []);

// 👤 PLAYER RANGE
  function isPlayerInRange(rangeX?: number, rangeY = 50) {
    if (playerState === "jump" || playerState === "blocked") return false;

    const defaultRangeX = player.character === "eduarda" ? 150 : 80;

    const dx = Math.abs(playerX - npcX);
    const dy = Math.abs(playerY - npcY);

    return dx <= (rangeX ?? defaultRangeX) && dy <= rangeY;
  }

  // 🤖 NPC RANGE
  function isNpcInRange(rangeX = 30, rangeY = 50) {
    const dx = Math.abs(playerX - npcX);
    const dy = Math.abs(playerY - npcY);

    return dx <= rangeX && dy <= rangeY;
  }

  // 👊 PLAYER HIT
  const playerHit = useCallback(() => {
    if (!playerCooldown.current) return;

    const char = progress[player.character];
    const dmg = 6 + char.stats.strength;

    playerCooldown.current = false;

    if (isPlayerInRange()) {

      setNpcHP((hp) => Math.max(0, hp - dmg));

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

    const char = progress[player.character];
    const dmg = 13 + (char.stats.intelligence * 2);

    playerCooldown.current = false;

    if (isPlayerInRange()) {
      setNpcHP((hp) => Math.max(0, hp - dmg)); // 💥 3x dano
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

    const npc = getNpcStats(npcLevel ?? 1, npcClass ?? "common");

    if (player.state === "blocked") return;

    if (isNpcInRange(20, 50)) {
      npcCooldown.current = false;

      setPlayerHP((hp) => Math.max(0, hp - npc.damage));

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
    resetBattle,
  };
}
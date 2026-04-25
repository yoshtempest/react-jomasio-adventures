import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";

import { calculatePlayerDamage, calculateSpecialDamage, calculateNpcDamage } from "@/rules/damage";
import { isPlayerInRange, isNpcInRange } from "@/rules/range";
import { getMaxSpecial, gainSpecial } from "@/rules/special";
import { isDead } from "@/rules/death";

type Props = {
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
}: Props) {
  const { player, playerClass } = usePlayer();
  const { progress } = useCharacterProgress();

  const char = progress[player.character];

  const playerMaxHp = useMemo(() => {
    return 90 + char.stats.hp * 10;
  }, [char.stats.hp]);

  const [playerHP, setPlayerHP] = useState(playerMaxHp);

  useEffect(() => {
    setPlayerHP(playerMaxHp);
  }, [playerMaxHp]);

  // npc section

  const npcMaxHp = useMemo(() => {
    return getNpcStats(npcLevel, npcClass).hp;
  }, [npcLevel, npcClass]);

  const [npcHP, setNpcHP] = useState(npcMaxHp);

  useEffect(() => {
    const npc = getNpcStats(npcLevel ?? 1, npcClass ?? "common");
    setNpcHP(npc.hp);
  }, [npcLevel, npcClass]);

  const playerCooldown = useRef(true);
  const npcCooldown = useRef(true);
  const isEnding = useRef(false);
  
  const [delicia, setDelicia] = useState(0);
  const HITS_TO_SPECIAL = getMaxSpecial(playerClass);

  const resetBattle = useCallback(() => {
    const npc = getNpcStats(npcLevel ?? 1, npcClass ?? "common");
    setPlayerHP(playerMaxHp);
    setNpcHP(npc.hp);
    setDelicia(0);

    playerCooldown.current = true;
    npcCooldown.current = true;
    isEnding.current = false;
  }, []);


  // 👊 PLAYER HIT
  const playerHit = useCallback(() => {
    if (!playerCooldown.current) return;

    if (!isPlayerInRange(
      playerX,
      playerY,
      npcX,
      npcY,
      playerState,
      player.character
    )) return;

    const dmg = calculatePlayerDamage(char.stats.strength, playerClass);

    setNpcHP((hp) => Math.max(0, hp - dmg));
    setDelicia((d) => gainSpecial(d, HITS_TO_SPECIAL));

    playerCooldown.current = false;

    setTimeout(() => {
      playerCooldown.current = true;
    }, 400);
  }, [playerX, playerY, npcX, npcY, playerState, player.character, char.stats.strength, playerClass]);

  const specialHit = useCallback(() => {
    if (!playerCooldown.current) return;
    if (delicia !== HITS_TO_SPECIAL) return;

    if (!isPlayerInRange(
      playerX,
      playerY,
      npcX,
      npcY,
      playerState,
      player.character
    )) return;

    const dmg = calculateSpecialDamage(char.stats.intelligence, playerClass);

    setNpcHP((hp) => Math.max(0, hp - dmg));
    setDelicia(0);

    playerCooldown.current = false;

    setTimeout(() => {
      playerCooldown.current = true;
    }, 600);
  }, [playerX, playerY, npcX, npcY, playerState, player.character, delicia, HITS_TO_SPECIAL, char.stats.intelligence, playerClass]);

  // 🤖 NPC HIT
  const npcHit = useCallback(() => {
  if (!npcCooldown.current) return;
  if (!isNpcInRange(playerX, playerY, npcX, npcY)) return;
  if (player.state === "blocked") return;

  const npc = getNpcStats(npcLevel, npcClass);

  const dmg = calculateNpcDamage(npc.damage, playerClass);

  setPlayerHP((hp) => Math.max(0, hp - dmg));

  npcCooldown.current = false;

  setTimeout(() => {
    npcCooldown.current = true;
  }, 800);
}, [playerX, playerY, npcX, npcY, npcLevel, npcClass, playerClass]);

  // 🧠 AUTO CHECK (MUITO MELHOR)
  useEffect(() => {
    if (isEnding.current) return;

    if (isDead(playerHP)) {
      isEnding.current = true;

      setTimeout(() => {
        const npc = getNpcStats(npcLevel ?? 1, npcClass ?? "common");

        setPlayerHP(playerMaxHp);
        setNpcHP(npc.hp);
        isEnding.current = false;
        onPlayerDeath();
      }, 500);
      return;
    }

    if (isDead(npcHP)) {
      isEnding.current = true;

      setTimeout(() => {
        onNpcDeath();
      }, 300);
    }
  }, [playerHP, npcHP, onPlayerDeath, onNpcDeath, npcLevel, npcClass, playerMaxHp]);

  return {
    playerHP,
    playerMaxHp,
    npcHP,
    npcMaxHp: getNpcStats(npcLevel, npcClass).hp,
    delicia,
    hitsToSpecial: HITS_TO_SPECIAL,
    
    playerHit,
    specialHit,
    npcHit,
    resetBattle,
  };
}
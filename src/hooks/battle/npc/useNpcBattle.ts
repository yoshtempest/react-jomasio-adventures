import { useCallback } from "react";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { isNpcInRange } from "@/gameRules/battle/range";
import { isFacingTarget } from "@/gameRules/battle/direction";
import type { NpcDifficulty, NPCClass } from "@/utils/types/npc/npcProgress";
import type { Player, PlayerClass } from "@/utils/types/player/player";
import type { DamageType } from "@/hooks/battle/useDamageNumbers";

type Props = {
  npcLevel: number;
  npcClass: NPCClass;
  playerClass: PlayerClass;

  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;

  player: Player;

  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  npcCooldown: React.RefObject<boolean>;
  difficulty: NpcDifficulty;
  isEnding: React.RefObject<boolean>;
  spawnDamageRef: React.RefObject<((value: number, x: number, y: number, type: DamageType) => void)>;
  hitstopRef: React.RefObject<number>;
};

export function useNpcBattle({
  npcLevel,
  npcClass,
  playerClass,
  setPlayerHP,
  npcCooldown,
  playerX,
  playerY,
  npcX,
  npcY,
  player,
  difficulty,
  isEnding,
  spawnDamageRef,
  hitstopRef,
}: Props) {
  const npcMeleeHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (!isNpcInRange(playerX, playerY, npcX, npcY)) return;
    if (player.state === "dash") return;
    if (
      player.state === "blocked" &&
      isFacingTarget(playerX, playerY, npcX, npcY, player.battleDirection)
    ) return;

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const dmg = calculateNpcDamage(npc.damage, playerClass);

    setPlayerHP(hp => Math.max(0, hp - dmg));
    navigator.vibrate?.(40);
    spawnDamageRef.current?.(dmg, playerX, playerY, "npc");
    hitstopRef.current = Date.now() + 50;

    npcCooldown.current = false;
    setTimeout(() => npcCooldown.current = true, 800);
  }, [
    isEnding,
    npcCooldown,
    player.state,
    player.battleDirection,
    npcLevel,
    npcClass,
    playerClass,
    setPlayerHP,
    playerX,
    playerY,
    npcX,
    npcY,
    difficulty,
    spawnDamageRef,
    hitstopRef,
  ]);

  const npcRangedHit = useCallback(() => {
    if (isEnding.current) return;
    if (!npcCooldown.current) return;
    if (player.state === "dash") return;
    if (
      player.state === "blocked" &&
      isFacingTarget(playerX, playerY, npcX, npcY, player.battleDirection)
    ) return;

    const npc = getNpcStats(npcLevel, npcClass, difficulty);
    const dmg = calculateNpcDamage(npc.damage, playerClass);

    setPlayerHP((hp) => Math.max(0, hp - dmg));
    navigator.vibrate?.(40);
    spawnDamageRef.current?.(dmg, playerX, playerY, "npc");
    hitstopRef.current = Date.now() + 30;

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), 800);
  }, [
    isEnding,
    npcCooldown,
    player.state,
    player.battleDirection,
    npcLevel,
    npcClass,
    playerClass,
    setPlayerHP,
    playerX,
    playerY,
    npcX,
    npcY,
    difficulty,
    spawnDamageRef,
    hitstopRef,
  ]);

  return { npcMeleeHit, npcRangedHit };
}
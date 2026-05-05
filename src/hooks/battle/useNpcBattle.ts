import { useCallback } from "react";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { calculateNpcDamage } from "@/gameRules/battle/damage";
import { isNpcInRange } from "@/gameRules/battle/range";

type Props = {
  npcLevel: number;
  npcClass: any;
  playerClass: any;

  playerX: number;
  playerY: number;
  npcX: number;
  npcY: number;

  player: any;

  setPlayerHP: React.Dispatch<React.SetStateAction<number>>;
  npcCooldown: React.RefObject<boolean>;
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
  player
}: Props) {
  const npcMeleeHit = useCallback(() => {
    if (!npcCooldown.current) return;
    if (!isNpcInRange(playerX, playerY, npcX, npcY)) return;
    if (player.state === "blocked") return;

    const npc = getNpcStats(npcLevel, npcClass);
    const dmg = calculateNpcDamage(npc.damage, playerClass);

    setPlayerHP(hp => Math.max(0, hp - dmg));

    npcCooldown.current = false;
    setTimeout(() => npcCooldown.current = true, 800);
  }, []);

  const npcRangedHit = useCallback(() => {
    if (!npcCooldown.current) return;
    if (player.state === "blocked") return;

    const npc = getNpcStats(npcLevel, npcClass);
    const dmg = calculateNpcDamage(npc.damage, playerClass);

    setPlayerHP((hp) => Math.max(0, hp - dmg));

    npcCooldown.current = false;
    setTimeout(() => (npcCooldown.current = true), 800);
  }, [
    npcCooldown,
    player.state,
    npcLevel,
    npcClass,
    playerClass,
    setPlayerHP
  ]);

  return { npcMeleeHit, npcRangedHit };
}
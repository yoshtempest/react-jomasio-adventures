import { useRef } from "react";

export function useBattleCooldowns() {
  const playerCooldown = useRef(true);
  const npcCooldown = useRef(true);
  const isEnding = useRef(false);

  return { playerCooldown, npcCooldown, isEnding };
}
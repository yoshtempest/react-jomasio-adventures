import { useRef } from "react";

export function useBattleCooldowns() {
  const npcCooldown = useRef(true);
  const isEnding = useRef(false);

  return { npcCooldown, isEnding };
}

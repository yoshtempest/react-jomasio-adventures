import { useRef } from "react";
import { useTitles } from "@/contexts/TitleContext";
import type { NPCClass } from "@/utils/types/npc/npcProgress";

export function useBattleKillCounter() {
  const { incrementKillCounter } = useTitles();
  const npcTypeRef = useRef("");
  const npcDataRef = useRef<{ class: NPCClass }>({ class: "common" });

  function handleNpcDeath(npcType: string, npcClass: NPCClass) {
    incrementKillCounter(npcType, npcClass);
  }

  return { npcTypeRef, npcDataRef, handleNpcDeath };
}

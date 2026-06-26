import { useRef } from "react";
import { useTitles } from "@/contexts/TitleContext";
import { useBestiary } from "@/contexts/BestiaryContext";

export function useBattleKillCounter() {
  const { incrementKillCounter } = useTitles();
  const { registerDefeat } = useBestiary();
  const npcTypeRef = useRef("");
  const npcDataRef = useRef<{ class: NPCClass }>({ class: "common" });

  function handleNpcDeath(npcType: string, npcClass: NPCClass) {
    incrementKillCounter(npcType, npcClass);
    registerDefeat(npcType);
  }

  return { npcTypeRef, npcDataRef, handleNpcDeath };
}

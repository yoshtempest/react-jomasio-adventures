import { useRef } from "react";
import { useTitles } from "@/contexts/TitleContext";
import { useBestiary } from "@/contexts/BestiaryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { incrementClassKill } from "@/utils/rewards/classKills";

export function useBattleKillCounter() {
  const { incrementKillCounter } = useTitles();
  const { registerDefeat } = useBestiary();
  const { player } = usePlayer();
  const { incrementKills } = useCharacterProgress();
  const npcTypeRef = useRef("");
  const npcDataRef = useRef<{ class: NPCClass }>({ class: "common" });

  function handleNpcDeath(npcType: string, npcClass: NPCClass) {
    incrementKillCounter(npcType, npcClass);
    registerDefeat(npcType);
    incrementKills(player.character);
    incrementClassKill(npcClass);
  }

  return { npcTypeRef, npcDataRef, handleNpcDeath };
}

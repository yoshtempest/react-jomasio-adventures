import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useQuests } from "@/contexts/QuestContext";
import { circularNext, circularPrev, gridMove } from "@/gameRules/menu/navigation";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";

export function useQuestMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { quests, claimQuest } = useQuests();
  const { addXP } = useCharacterProgress();
  const { player } = usePlayer();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  // mantém ref sincronizada (evita stale no confirm)
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // garante que o índice nunca fique inválido
  useEffect(() => {
    setSelectedIndex((prev) =>
      quests.length === 0 ? 0 : Math.min(prev, quests.length - 1)
    );
  }, [quests]);

  function handleUseQuest(index: number) {
    const quest = quests[index];
    if (!quest) return false;

    if (!quest.completed || quest.claimed) return false;

    if (quest.rewardsType === "xp" && quest.rewards) {
      addXP(player.character, quest.rewards);
      claimQuest(quest.id);
    }

    return true;
  }

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onRight: () => {
        setSelectedIndex((prev) =>
          circularNext(prev, quests.length)
        );
      },

      onLeft: () => {
        setSelectedIndex((prev) =>
          circularPrev(prev, quests.length)
        );
      },

      onDown: () => {
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "down", quests.length) // 👈 2 colunas
        );
      },

      onUp: () => {
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "up", quests.length) // 👈 2 colunas
        );
      },

      onConfirm: () => {
        return handleUseQuest(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, [isOpen, quests]); // 👈 ESSENCIAL

  return {
    selectedIndex,
    options: quests,
  };
}
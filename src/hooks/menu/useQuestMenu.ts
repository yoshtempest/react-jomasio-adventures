import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useQuests } from "@/contexts/QuestContext";
import { questEffects } from "@/gameRules/quests/effects";

export function useQuestMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { quests } = useQuests();

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
  function getEffect(id: string) {
    return questEffects[id];
  }

  function handleUseQuest(index: number) {
    const quest = quests[index];
    if (!quest) return false;

    const effect = getEffect(quest.id);
    if (!effect) return false;

    effect();
    return true;
  }

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        const length = quests.length;
        if (length === 0) return;

        setSelectedIndex((prev) =>
          circularPrev(prev, length)
        );
      },

      onDown: () => {
        const length = quests.length;
        if (length === 0) return;

        setSelectedIndex((prev) =>
          circularNext(prev, length)
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
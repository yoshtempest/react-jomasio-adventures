import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useQuests } from "@/contexts/QuestContext";
import { questEffects } from "@/gameRules/quests/effects";
import { circularNext, circularPrev, gridMove } from "@/gameRules/menu/navigation";

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
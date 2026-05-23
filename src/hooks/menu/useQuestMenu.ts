import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useQuests } from "@/contexts/QuestContext";
import { circularNext, circularPrev, gridMove } from "@/gameRules/menu/navigation";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

export function useQuestMenu(
  isOpen: boolean,
  listRef?: React.RefObject<HTMLUListElement | null>
) {
  const { pushControls, popControls } = useGameControls();
  
  const { quests, claimQuest } = useQuests();
  const { addXP } = useCharacterProgress();
  const { player, addCoins } = usePlayer();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  // mantém ref sincronizada (evita stale no confirm)
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!listRef?.current) return;

    const container = listRef.current;
    const selectedElement = container.children[selectedIndex] as HTMLElement;

    if (!selectedElement) return;

    const COLS = 3;

    // 👇 calcula em qual linha estamos
    const rowIndex = Math.floor(selectedIndex / COLS);

    // pega altura de um item (assumindo grid uniforme)
    const itemHeight = selectedElement.offsetHeight;

    // pega gap (IMPORTANTE)
    const styles = window.getComputedStyle(container);
    const gap = parseInt(styles.rowGap || "0");

    const rowHeight = itemHeight + gap;

    // 👇 scroll baseado na linha (não no item)
    const targetScroll = rowIndex * rowHeight;

    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
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

    if (quest.rewardsType === "coin" && quest.rewards) {
      addCoins(quest.rewards); // 👈 AQUI
      claimQuest(quest.id);
    }

    return true;
  }

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onRight: () => {
        playMove();
        setSelectedIndex((prev) =>
          circularNext(prev, quests.length)
        );
      },

      onLeft: () => {
        playMove();
        setSelectedIndex((prev) =>
          circularPrev(prev, quests.length)
        );
      },

      onDown: () => {
        playMove();
        setSelectedIndex((prev) =>
          gridMove(prev, 3, "down", quests.length) // 👈 3 colunas
        );
      },

      onUp: () => {
        playMove();
        setSelectedIndex((prev) =>
          gridMove(prev, 3, "up", quests.length) // 👈 3 colunas
        );
      },

      onConfirm: () => {
        playSelect();
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
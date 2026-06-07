import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useQuests } from "@/contexts/QuestContext";
import { gridMove } from "@/gameRules/menu/navigation";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import type { Quest } from "@/utils/types/player/quest";

export type QuestTab = "active" | "completed";

export function useQuestMenu(
  isOpen: boolean,
  allQuests: Quest[],
  listRef?: React.RefObject<HTMLUListElement | null>
) {
  const { pushControls, popControls } = useGameControls();

  const { quests, claimQuest } = useQuests();
  const { addXP } = useCharacterProgress();
  const { player, addCoins } = usePlayer();
  const { playMove, playSelect } = useMenuSFX();

  const [activeTab, setActiveTab] = useState<QuestTab>("active");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  const activeQuests = allQuests.filter((q) => !q.completed || !q.claimed);
  const completedQuests = allQuests.filter((q) => q.completed && q.claimed);
  const visibleQuests = activeTab === "active" ? activeQuests : completedQuests;

  // mantém ref sincronizada (evita stale no confirm)
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!listRef?.current) return;

    const container = listRef.current;

    if (container.children.length === 0) return;

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

  // garante que o índice nunca fique inválido ao trocar de aba
  useEffect(() => {
    setSelectedIndex((prev) =>
      visibleQuests.length === 0 ? 0 : Math.min(prev, visibleQuests.length - 1)
    );
  }, [visibleQuests]);

  function handleUseQuest(index: number) {
    const quest = quests.find((q) => q.id === visibleQuests[index]?.id);
    if (!quest) return false;

    if (!quest.completed || quest.claimed) return false;

    if (quest.rewardsType === "xp" && quest.rewards) {
      addXP(player.character, quest.rewards);
      claimQuest(quest.id);
    }

    if (quest.rewardsType === "coin" && quest.rewards) {
      addCoins(quest.rewards);
      claimQuest(quest.id);
    }

    return true;
  }

  function switchTab(tab: QuestTab) {
    setActiveTab(tab);
    setSelectedIndex(0);
  }

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onRight: () => {
        playMove();
        setActiveTab((prev) => (prev === "active" ? "completed" : "active"));
        setSelectedIndex(0);
      },

      onLeft: () => {
        playMove();
        setActiveTab((prev) => (prev === "completed" ? "active" : "completed"));
        setSelectedIndex(0);
      },

      onDown: () => {
        playMove();
        setSelectedIndex((prev) =>
          gridMove(prev, 3, "down", visibleQuests.length)
        );
      },

      onUp: () => {
        playMove();
        setSelectedIndex((prev) =>
          gridMove(prev, 3, "up", visibleQuests.length)
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
  }, [isOpen, visibleQuests, activeTab]);

  return {
    selectedIndex,
    activeTab,
    activeQuests,
    completedQuests,
    visibleQuests,
    switchTab,
  };
}

import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useQuests } from "@/contexts/QuestContext";
import { gridMove } from "@/gameRules/menu/navigation";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import type { Quest } from "@/utils/types/player/quest";

export type QuestTab = "active" | "completed";

const TAB_COUNT = 2;
const COLS = 3;

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
  const totalItems = TAB_COUNT + visibleQuests.length;

  // mantém ref sincronizada
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // scroll automático em quest cards (ignora abas)
  useEffect(() => {
    if (!listRef?.current) return;

    const questIndex = selectedIndex - TAB_COUNT;
    if (questIndex < 0) return;

    const container = listRef.current;
    const selectedElement = container.children[questIndex] as HTMLElement;
    if (!selectedElement) return;

    const rowIndex = Math.floor(questIndex / COLS);
    const itemHeight = selectedElement.offsetHeight;
    const styles = window.getComputedStyle(container);
    const gap = parseInt(styles.rowGap || "0");
    const rowHeight = itemHeight + gap;
    const targetScroll = rowIndex * rowHeight;

    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, [selectedIndex, listRef]);

  // garante índice válido quando totalItems muda
  useEffect(() => {
    setSelectedIndex((prev) =>
      totalItems === 0 ? 0 : Math.min(prev, totalItems - 1)
    );
  }, [totalItems]);

  function handleUseItem(index: number) {
    if (index < TAB_COUNT) {
      const tab: QuestTab = index === 0 ? "active" : "completed";
      playSelect();
      setActiveTab(tab);
      setSelectedIndex(index);
      return true;
    }

    const quest = quests.find((q) => q.id === visibleQuests[index - TAB_COUNT]?.id);
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
    setSelectedIndex(tab === "active" ? 0 : 1);
  }

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const handleUseItemRef = useRef<(index: number) => boolean>(() => false);
  handleUseItemRef.current = handleUseItem;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, COLS, "right", totalItems));
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, COLS, "left", totalItems));
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, COLS, "down", totalItems));
      },

      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => gridMove(prev, COLS, "up", totalItems));
      },

      onConfirm: () => {
        return handleUseItemRef.current(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, totalItems]);

  return {
    selectedIndex,
    activeTab,
    activeQuests,
    completedQuests,
    visibleQuests,
    switchTab,
  };
}

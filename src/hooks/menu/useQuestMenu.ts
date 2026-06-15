import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useQuests } from "@/contexts/QuestContext";
import { gridMove } from "@/gameRules/menu/navigation";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { ITEMS } from "@/data/items";
import type { Quest } from "@/utils/types/player/quest";

export type QuestTab = "active" | "completed" | "daily" | "weekly";

const TABS: QuestTab[] = ["active", "completed", "daily", "weekly"];
const TAB_COUNT = TABS.length;
const COLS = 3;

export function useQuestMenu(
  isOpen: boolean,
  allQuests: Quest[],
  listRef?: React.RefObject<HTMLUListElement | null>
) {
  const { pushControls, popControls } = useGameControls();

  const { quests, claimQuest } = useQuests();
  const { addXP } = useCharacterProgress();
  const { player, addCoins, addHyperCoins } = usePlayer();
  const { addItem } = useInventory();
  const { playMove, playSelect } = useMenuSFX();

  const [activeTab, setActiveTab] = useState<QuestTab>("active");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeQuests = allQuests.filter(
    (q) => q.frequency !== "daily" && q.frequency !== "weekly" && (!q.completed || !q.claimed)
  );
  const completedQuests = allQuests.filter(
    (q) => q.frequency !== "daily" && q.frequency !== "weekly" && q.completed && q.claimed
  );
  const dailyQuests = allQuests.filter(
    (q) => q.frequency === "daily" && !q.claimed
  );
  const weeklyQuests = allQuests.filter(
    (q) => q.frequency === "weekly" && !q.claimed
  );

  const tabMap: Record<QuestTab, Quest[]> = {
    active: activeQuests,
    completed: completedQuests,
    daily: dailyQuests,
    weekly: weeklyQuests,
  };

  const visibleQuests = tabMap[activeTab];
  const totalCards = visibleQuests.length;
  const totalItems = TAB_COUNT + totalCards;

  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex((prev) => {
      const currentTabIndex = TABS.indexOf(activeTab);
      if (prev < TAB_COUNT) return currentTabIndex;
      if (totalCards === 0) return currentTabIndex;
      const cardIndex = prev - TAB_COUNT;
      if (cardIndex >= totalCards) return TAB_COUNT + totalCards - 1;
      return prev;
    });
  }, [activeTab, totalCards]);

  useEffect(() => {
    if (!listRef?.current) return;

    const cardIndex = selectedIndex - TAB_COUNT;
    if (cardIndex < 0) return;

    const container = listRef.current;
    const selectedElement = container.children[cardIndex] as HTMLElement;
    if (!selectedElement) return;

    const rowIndex = Math.floor(cardIndex / COLS);
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

  function switchTab(tab: QuestTab) {
    setActiveTab(tab);
    setSelectedIndex(TABS.indexOf(tab));
  }

  function handleUseItem(index: number) {
    if (index < TAB_COUNT) {
      const tab = TABS[index];
      playSelect();
      switchTab(tab);
      return true;
    }

    const cardIndex = index - TAB_COUNT;
    const quest = quests.find((q) => q.id === visibleQuests[cardIndex]?.id);
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

    if (quest.rewardsType === "hyperCoin" && quest.rewards) {
      addHyperCoins(quest.rewards);
      claimQuest(quest.id);
    }

    if (quest.rewardsType === "item" && quest.rewardItemId) {
      const itemDef = ITEMS[quest.rewardItemId as keyof typeof ITEMS];
      if (itemDef) {
        addItem({ id: itemDef.id, name: itemDef.name });
      }
      claimQuest(quest.id);
    }

    return true;
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
        setSelectedIndex((prev) => {
          if (prev < TAB_COUNT) {
            return (prev + 1) % TAB_COUNT;
          }
          return gridMove(prev, COLS, "right", totalItems);
        });
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => {
          if (prev < TAB_COUNT) {
            return (prev - 1 + TAB_COUNT) % TAB_COUNT;
          }
          return gridMove(prev, COLS, "left", totalItems);
        });
      },

      onDown: () => {
        if (totalCards === 0) return;
        playMoveRef.current();
        setSelectedIndex((prev) => {
          if (prev < TAB_COUNT) {
            return TAB_COUNT;
          }
          return gridMove(prev, COLS, "down", totalItems);
        });
      },

      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => {
          if (prev < TAB_COUNT) return prev;
          const next = gridMove(prev, COLS, "up", totalItems);
          if (next < TAB_COUNT) {
            return TABS.indexOf(activeTab);
          }
          return next;
        });
      },

      onConfirm: () => {
        return handleUseItemRef.current(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, totalItems, totalCards, activeTab]);

  // Sync activeTab when selectedIndex moves across tabs
  useEffect(() => {
    if (selectedIndex < TAB_COUNT) {
      const tab = TABS[selectedIndex];
      if (tab !== activeTab) {
        setActiveTab(tab);
      }
    }
  }, [selectedIndex, activeTab]);

  return {
    selectedIndex,
    activeTab,
    activeQuests,
    completedQuests,
    dailyQuests,
    weeklyQuests,
    visibleQuests,
    switchTab,
  };
}
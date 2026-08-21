import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useQuests } from "@/contexts/QuestContext";
import { gridMove } from "@/gameRules/menu/navigation";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { ITEMS } from "@/data/items";
import { useQuestItems } from "./useQuestItems";
import type { QuestTab } from "@/utils/types/player/quest";
import { QUEST_TABS, TAB_COUNT } from "@/data/quests/tabs";

const COLS = 3;

export function useQuestMenu(
  isOpen: boolean,
  allQuests: Quest[],
  listRef?: React.RefObject<HTMLUListElement | null>,
) {
  const { pushControls } = useGameControls();

  const { quests, claimQuest } = useQuests();
  const { addXP, addCoins, addHyperCoins } = useCharacterProgress();
  const { player } = usePlayer();
  const { addItem } = useInventory();
  const { playMove, playSelect } = useMenuSFX();

  const [activeTab, setActiveTab] = useState<QuestTab>("active");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    visibleQuests,
    activeQuests,
    completedQuests,
    dailyQuests,
    weeklyQuests,
  } = useQuestItems(allQuests, activeTab);

  const totalCards = visibleQuests.length;
  const totalItems = TAB_COUNT + totalCards;

  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex((prev) => {
      const currentTabIndex = QUEST_TABS.indexOf(activeTab);
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

    const selectedElement = listRef.current.children[cardIndex] as HTMLElement;
    if (!selectedElement) return;

    selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex, listRef]);

  function switchTab(tab: QuestTab) {
    setActiveTab(tab);
    setSelectedIndex(QUEST_TABS.indexOf(tab));
  }

  function handleUseItem(index: number) {
    if (index < TAB_COUNT) {
      const tab = QUEST_TABS[index]!;
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
      addCoins(player.character, quest.rewards);
      claimQuest(quest.id);
    }

    if (quest.rewardsType === "hyperCoin" && quest.rewards) {
      addHyperCoins(player.character, quest.rewards);
      claimQuest(quest.id);
    }

    if (quest.rewardsType === "item" && quest.rewardItemId) {
      const itemDef = ITEMS[quest.rewardItemId];
      if (itemDef) {
        addItem({ id: itemDef.id });
      }
      claimQuest(quest.id);
    }

    return true;
  }

  const playMoveRef = useLatestRef(playMove);
  const pushControlsRef = useLatestRef(pushControls);
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
            return QUEST_TABS.indexOf(activeTab);
          }
          return next;
        });
      },

      onConfirm: () => {
        return handleUseItemRef.current(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);
    return () => remove();
  }, [isOpen, totalItems, totalCards, activeTab, playMoveRef, pushControlsRef]);

  // Sync activeTab when selectedIndex moves across tabs
  useEffect(() => {
    if (selectedIndex < TAB_COUNT) {
      const tab = QUEST_TABS[selectedIndex]!;
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

import { useConfigSelection } from "@/hooks/menu/config/useConfigSelection";

export function useConfigMenu(isActive: boolean = true) {
  const {
    difficulty,
    selectedIndex,
    selectedColumn,
    screen,
    showQuestIndicator,
    showComboAction,
    activeTab,
    isOnTab,
  } = useConfigSelection(isActive);

  return {
    difficultyList: difficulty,
    selectedIndex,
    selectedColumn,
    screen,
    showQuestIndicator,
    showComboAction,
    activeTab,
    isOnTab,
  };
}

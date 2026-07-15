import { useConfigSelection } from "@/hooks/menu/config/useConfigSelection";

export function useConfigMenu(isActive: boolean = true) {
  const { difficulty, selectedIndex, selectedRow, bottomIndex, screen, showQuestIndicator, activeTab, isOnTab } =
    useConfigSelection(isActive);

  return {
    difficultyList: difficulty,
    selectedIndex,
    selectedRow,
    bottomIndex,
    screen,
    showQuestIndicator,
    activeTab,
    isOnTab,
  };
}

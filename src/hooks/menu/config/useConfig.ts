import { useConfigSelection } from "@/hooks/menu/config/useConfigSelection";

export function useConfigMenu(isActive: boolean = true) {
  const { difficulty, selectedIndex, selectedRow, screen, showQuestIndicator } =
    useConfigSelection(isActive);

  return {
    difficultyList: difficulty,
    selectedIndex,
    selectedRow,
    screen,
    showQuestIndicator,
  };
}

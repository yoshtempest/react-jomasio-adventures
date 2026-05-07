import { useConfigSelection } from "@/hooks/menu/useConfigSelection";

export function useConfigMenu(isActive: boolean = true) {
  const { difficulty, selectedIndex, selectedRow } = useConfigSelection(isActive);

  return {
    difficultyList: difficulty,
    selectedIndex,
    selectedRow,
  };
}
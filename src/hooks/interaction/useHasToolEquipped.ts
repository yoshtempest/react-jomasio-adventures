import { useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";

export function useHasToolEquipped() {
  const { player } = usePlayer();
  const { getEquippedItem } = useEquipment();

  return useCallback(
    (toolId: EquipmentId) =>
      getEquippedItem(player.character, "weapon")?.id === toolId,
    [getEquippedItem, player.character],
  );
}

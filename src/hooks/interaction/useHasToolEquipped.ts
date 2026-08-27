import { useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { isProfessionWeaponOf } from "@/gameRules/professions/weapon";

export function useEquippedWeaponId(): string | null {
  const { player } = usePlayer();
  const { getEquippedItem } = useEquipment();
  return getEquippedItem(player.character, "weapon")?.id ?? null;
}

export function useHasToolEquipped() {
  const { player } = usePlayer();
  const { getEquippedItem } = useEquipment();

  return useCallback(
    (toolId: EquipmentId) => {
      const weaponId = getEquippedItem(player.character, "weapon")?.id;
      if (!weaponId) return false;
      if (weaponId === toolId) return true;
      return isProfessionWeaponOf(weaponId, toolId);
    },
    [getEquippedItem, player.character],
  );
}

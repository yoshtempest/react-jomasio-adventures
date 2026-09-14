import { useEffect, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponId,
  getProfessionWeaponConfig,
  type ProfessionWeaponConfig,
} from "@/data/professions/weapons";
import { canCraft, getMaterialCount } from "@/gameRules/professions/craft";
import type { ProfessionInfo } from "@/utils/types/player/profession";

const TIER_COUNT = PROFESSION_WEAPON_TIERS.length;

type Props = {
  profession: ProfessionInfo;
  config: ProfessionWeaponConfig;
  onClose: () => void;
};

export function useProfessionDetail({ profession, config, onClose }: Props) {
  const { player } = usePlayer();
  const {
    addDrop,
    isOwned,
    getEquippedItem,
    getQuantity,
    equip,
    upgradeProfessionWeapon,
  } = useEquipment();
  const { items, removeItem } = useInventory();
  const { playMove, playSelect, playClose } = useMenuSFX();
  const { pushControls } = useGameControls();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const character = player.character;
  const equippedWeaponId = getEquippedItem(character, "weapon")?.id;
  const isOwnedAny = (id: EquipmentId) => isOwned(character, id);
  const count = (id: string) => getMaterialCount(items, id);

  const selectedIndexRef = useLatestRef(selectedIndex);
  const onCloseRef = useLatestRef(onClose);

  function isTierOwned(tierIndex: number): boolean {
    const tier = PROFESSION_WEAPON_TIERS[tierIndex];
    if (!tier) return false;
    return isOwnedAny(getProfessionWeaponId(config, tier.id));
  }

  function getHighestOwnedTierIndex(): number {
    let max = -1;
    for (let i = TIER_COUNT - 1; i >= 0; i--) {
      if (isTierOwned(i)) {
        max = i;
        break;
      }
    }
    if (equippedWeaponId) {
      const weaponConfig = getProfessionWeaponConfig(equippedWeaponId);
      if (weaponConfig && weaponConfig === config) {
        for (let i = TIER_COUNT - 1; i >= 0; i--) {
          if (
            getProfessionWeaponId(config, PROFESSION_WEAPON_TIERS[i]!.id) ===
            equippedWeaponId
          ) {
            if (i > max) max = i;
            break;
          }
        }
      }
    }
    return max;
  }

  function canCraftTier(tierIndex: number): boolean {
    if (tierIndex === 0) {
      return canCraft(profession.recipe, count);
    }
    const prevTier = PROFESSION_WEAPON_TIERS[tierIndex - 1];
    if (!prevTier) return false;
    return count(config.materialId) >= prevTier.materialQty;
  }

  function craftTier(tierIndex: number) {
    if (tierIndex === 0) {
      if (!canCraft(profession.recipe, count)) {
        playClose();
        setMessage("Materiais insuficientes!");
        return;
      }
      for (const [id, qty] of Object.entries(profession.recipe)) {
        for (let i = 0; i < (qty ?? 1); i++) {
          removeItem(id as ItemId);
        }
      }
      addDrop(character, profession.toolId);
      playSelect();
      setMessage(`Ferramenta craftada: ${config.baseName} Comum`);
      return;
    }

    const fromTierIndex = tierIndex - 1;
    const fromTier = PROFESSION_WEAPON_TIERS[fromTierIndex];
    const toTier = PROFESSION_WEAPON_TIERS[tierIndex];
    if (!fromTier || !toTier) return;

    if (!isTierOwned(fromTierIndex)) {
      playClose();
      setMessage(`Você precisa primeiro da versão ${fromTier.label}!`);
      return;
    }

    if (count(config.materialId) < fromTier.materialQty) {
      playClose();
      setMessage(
        `Faltam materiais: ${config.materialName} (${count(config.materialId)}/${fromTier.materialQty})`,
      );
      return;
    }

    for (let i = 0; i < fromTier.materialQty; i++) {
      removeItem(config.materialId);
    }

    const sourceWeaponId = getProfessionWeaponId(config, fromTier.id);
    const wasEquipped = equippedWeaponId === sourceWeaponId;
    const sourceOnlyInEquip =
      wasEquipped && getQuantity(character, sourceWeaponId, 0) === 0;

    if (upgradeProfessionWeapon(character, config, fromTier.id, toTier.id)) {
      if (sourceOnlyInEquip) {
        equip(character, getProfessionWeaponId(config, toTier.id));
      }
    }

    playSelect();
    setMessage(`${config.baseName} ${toTier.label} criada!`);
  }

  const craftTierRef = useLatestRef(craftTier);
  const playMoveRef = useLatestRef(playMove);
  const playCloseRef = useLatestRef(playClose);
  const pushControlsRef = useLatestRef(pushControls);

  useEffect(() => {
    const remove = pushControlsRef.current({
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => (prev - 1 + TIER_COUNT) % TIER_COUNT);
        return true;
      },
      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => (prev + 1) % TIER_COUNT);
        return true;
      },
      onConfirm: () => {
        craftTierRef.current(selectedIndexRef.current);
        return true;
      },
      onCancel: () => {
        playCloseRef.current();
        onCloseRef.current();
        return true;
      },
      blockGlobalOpen: true,
    });
    return remove;
  }, [
    playMoveRef,
    playCloseRef,
    pushControlsRef,
    craftTierRef,
    onCloseRef,
    selectedIndexRef,
  ]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return {
    selectedIndex,
    message,
    isTierOwned,
    getHighestOwnedTierIndex,
    canCraftTier,
  };
}

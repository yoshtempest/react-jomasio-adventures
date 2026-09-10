import { useEffect, useRef, useState } from "react";

import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useProfessionProgress } from "@/contexts/ProfessionProgressContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { PROFESSIONS } from "@/data/professions";
import { ITEMS } from "@/data/items";
import {
  PROFESSION_WEAPONS,
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponConfig,
  getProfessionWeaponId,
  getProfessionWeaponTier,
  getTierIndex,
  type ProfessionWeaponTierId,
} from "@/data/professions/weapons";
import { canCraft, getMaterialCount } from "@/gameRules/professions/craft";
import { asset } from "@/utils/paths";
import styles from "./styles.module.css";
import { ProgressBar } from "@/components/Game/ProgressBar";
import { ProfessionDetail } from "./ProfessionDetail";

function getOwnedTierIndex(
  isOwned: (id: EquipmentId) => boolean,
  equippedWeaponId: string | undefined,
  config: (typeof PROFESSION_WEAPONS)[keyof typeof PROFESSION_WEAPONS],
): number {
  let max = -1;
  for (const tier of PROFESSION_WEAPON_TIERS) {
    const owned = isOwned(getProfessionWeaponId(config, tier.id));
    const idx = getTierIndex(tier.id);
    if (owned && idx > max) max = idx;
  }
  if (equippedWeaponId && getProfessionWeaponTier(equippedWeaponId)) {
    const idx = getTierIndex(
      getProfessionWeaponTier(equippedWeaponId) as ProfessionWeaponTierId,
    );
    if (idx > max) max = idx;
  }
  return max;
}

export function Professions() {
  const { player } = usePlayer();
  const { isOwned, getEquippedItem } = useEquipment();
  const { items } = useInventory();
  const { getProficiency, getXPToNextProfessionLevel } =
    useProfessionProgress();
  const { playMove, playClose } = useMenuSFX();
  const { pushControls } = useGameControls();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openProfession, setOpenProfession] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const character = player.character;
  const equippedWeaponId = getEquippedItem(character, "weapon")?.id;
  const isOwnedAny = (id: EquipmentId) => isOwned(character, id);

  const selectedIndexRef = useRef(selectedIndex);
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const playMoveRef = useLatestRef(playMove);
  const playCloseRef = useLatestRef(playClose);
  const pushControlsRef = useLatestRef(pushControls);

  useEffect(() => {
    if (openProfession !== null) return;
    const remove = pushControlsRef.current({
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex(
          (prev) => (prev - 1 + PROFESSIONS.length) % PROFESSIONS.length,
        );
        return true;
      },
      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => (prev + 1) % PROFESSIONS.length);
        return true;
      },
      onConfirm: () => {
        setOpenProfession(selectedIndexRef.current);
        return true;
      },
      blockGlobalOpen: true,
    });
    return remove;
  }, [playMoveRef, playCloseRef, pushControlsRef, openProfession]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  if (openProfession !== null) {
    const profession = PROFESSIONS[openProfession];
    const config = profession ? PROFESSION_WEAPONS[profession.id] : undefined;
    if (profession && config) {
      return (
        <div className="containerOfNavbar">
          <ProfessionDetail
            profession={profession}
            config={config}
            items={items}
            onClose={() => setOpenProfession(null)}
          />
        </div>
      );
    }
    setOpenProfession(null);
  }

  return (
    <div className="containerOfNavbar">
      <h3 className={styles.header}>Profissões</h3>
      <ul className={styles.list} ref={listRef}>
        {PROFESSIONS.map((profession, index) => {
          const config = PROFESSION_WEAPONS[profession.id];
          if (!config) return null;
          const equipped = equippedWeaponId
            ? getProfessionWeaponConfig(equippedWeaponId)?.professionId ===
              profession.id
            : false;
          const ownedTierIndex = getOwnedTierIndex(
            isOwnedAny,
            equippedWeaponId,
            config,
          );
          const owned = ownedTierIndex >= 0;
          const currentTier =
            ownedTierIndex >= 0
              ? PROFESSION_WEAPON_TIERS[ownedTierIndex]
              : undefined;
          const nextTier =
            ownedTierIndex >= 0 &&
            ownedTierIndex < PROFESSION_WEAPON_TIERS.length - 1
              ? PROFESSION_WEAPON_TIERS[ownedTierIndex + 1]
              : undefined;
          const isSelected = index === selectedIndex;
          const proficiencyEntry = getProficiency(character, profession.id);
          const xpToNext = getXPToNextProfessionLevel(proficiencyEntry.level);
          const count = (id: string) => getMaterialCount(items, id);
          const can = canCraft(profession.recipe, count);

          return (
            <li
              key={profession.id}
              className={`${styles.item} ${isSelected ? styles.selected : ""}`}
              onClick={() => setOpenProfession(index)}
            >
              <div className={styles.info}>
                <span className={styles.name}>{profession.name}</span>
                <span className={styles.npc}>{profession.npcName}</span>
                <span className={styles.element}>
                  Bônus vs {config.element}
                </span>
                <div className={styles.proficiency}>
                  <span className={styles.levelBadge}>
                    Nv {proficiencyEntry.level}
                  </span>
                  <ProgressBar
                    value={proficiencyEntry.xp}
                    max={xpToNext}
                    animationId={`prof-xp-${character}-${profession.id}`}
                    level={proficiencyEntry.level}
                  />
                  <span className={styles.xpText}>
                    {proficiencyEntry.xp}/{xpToNext}
                  </span>
                </div>

                <div className={styles.ladder}>
                  {PROFESSION_WEAPON_TIERS.map((tier) => {
                    const idx = getTierIndex(tier.id);
                    const reached = idx <= ownedTierIndex;
                    return (
                      <span
                        key={tier.id}
                        title={tier.label}
                        className={`${styles.ladderStep} ${
                          reached ? styles.ladderReached : ""
                        } ${idx === ownedTierIndex ? styles.ladderCurrent : ""}`}
                      />
                    );
                  })}
                  {owned &&
                    currentTier &&
                    ownedTierIndex < PROFESSION_WEAPON_TIERS.length - 1 &&
                    nextTier && (
                      <span className={styles.ladderNext}>
                        → {nextTier.label} ×{currentTier.materialQty}{" "}
                        {config.materialName}
                      </span>
                    )}
                </div>
              </div>

              <div className={styles.tool}>
                <img
                  src={asset("/assets/equipments/weapons.svg")}
                  alt=""
                  className={styles.toolIcon}
                />
                <span>
                  {owned && currentTier
                    ? currentTier.label
                    : profession.toolName}
                </span>
              </div>

              {ownedTierIndex < 0 && (
                <div className={styles.recipe}>
                  {Object.entries(profession.recipe).map(([id, qty]) => {
                    const def = ITEMS[id as keyof typeof ITEMS];
                    const ownedQty = count(id);
                    const enough = ownedQty >= (qty ?? 1);
                    return (
                      <span
                        key={id}
                        className={`${styles.material} ${
                          enough ? styles.have : styles.missing
                        }`}
                      >
                        <span>
                          {def ? def.name : id} x{qty} ({ownedQty}/{qty})
                        </span>
                      </span>
                    );
                  })}
                </div>
              )}

              <span
                className={`${styles.status} ${
                  equipped ? styles.statusDone : ""
                } ${ownedTierIndex < 0 && can ? styles.statusReady : ""}`}
              >
                {equipped
                  ? "Equipada"
                  : ownedTierIndex < 0
                    ? can
                      ? "Craftar"
                      : "Falta material"
                    : ownedTierIndex >= PROFESSION_WEAPON_TIERS.length - 1
                      ? "Máximo"
                      : "Evoluir"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

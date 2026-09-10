import {
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponConfig,
  getTierIndex,
  type ProfessionWeaponConfig,
} from "@/data/professions/weapons";
import { ITEMS } from "@/data/items";
import { canCraft, getMaterialCount } from "@/gameRules/professions/craft";
import { asset } from "@/utils/paths";
import { getOwnedTierIndex } from "../professionUtils";
import type { ProfessionInfo, ProfessionProficiency } from "@/utils/types/player/profession";
import type { Character } from "@/utils/types/player/player";
import { ProgressBar } from "@/components/Game/ProgressBar";
import styles from "./styles.module.css";

type Props = {
  profession: ProfessionInfo;
  config: ProfessionWeaponConfig;
  selected: boolean;
  character: Character;
  equippedWeaponId: string | undefined;
  isOwnedAny: (id: EquipmentId) => boolean;
  proficiency: ProfessionProficiency;
  xpToNext: number;
  items: { id: string; qty?: number }[];
  onOpen: () => void;
};

export function ProfessionItem({
  profession,
  config,
  selected,
  character,
  equippedWeaponId,
  isOwnedAny,
  proficiency,
  xpToNext,
  items,
  onOpen,
}: Props) {
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
  const count = (id: string) => getMaterialCount(items, id);
  const can = canCraft(profession.recipe, count);

  return (
    <li
      className={`${styles.item} ${selected ? styles.selected : ""}`}
      onClick={onOpen}
    >
      <div className={styles.info}>
        <span className={styles.name}>{profession.name}</span>
        <span className={styles.npc}>{profession.npcName}</span>
        <span className={styles.element}>Bônus vs {config.element}</span>
        <div className={styles.proficiency}>
          <span className={styles.levelBadge}>Nv {proficiency.level}</span>
          <ProgressBar
            value={proficiency.xp}
            max={xpToNext}
            animationId={`prof-xp-${character}-${profession.id}`}
            level={proficiency.level}
          />
          <span className={styles.xpText}>
            {proficiency.xp}/{xpToNext}
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
          {owned && currentTier ? currentTier.label : profession.toolName}
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
}
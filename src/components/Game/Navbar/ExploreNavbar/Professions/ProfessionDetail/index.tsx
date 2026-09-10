import { useRef, useEffect } from "react";
import { getEquipmentById } from "@/data/equipment";
import {
  PROFESSION_WEAPON_TIERS,
  getProfessionWeaponId,
} from "@/data/professions/weapons";
import { ITEMS } from "@/data/items";
import { RANK_COLORS, RANK_LABELS } from "@/data/equipment/definitions";
import { asset } from "@/utils/paths";
import { useProfessionDetail } from "@/hooks/menu/professions/useProfessionDetail";
import type { ProfessionWeaponConfig } from "@/data/professions/weapons";
import type { ProfessionInfo } from "@/utils/types/player/profession";
import type { InventoryItem } from "@/utils/types/player/inventory";
import styles from "./styles.module.css";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  strength: "Força",
  intelligence: "Inteligência",
  armor: "Armadura",
  shield: "Escudo",
  vampirism: "Vampirismo",
  reflect: "Reflexão",
  tenacity: "Tenacidade",
  luck: "Sorte",
  maxHpDamage: "Dano HP",
  trueDamage: "Dano Real",
};

function professionIcon(id: string): string {
  if (id === "lumberjack") return "/assets/badges/professions/farmer.svg";
  if (id === "chef") return "/assets/badges/professions/pastryChef.svg";
  return `/assets/badges/professions/${id}.svg`;
}

type Props = {
  profession: ProfessionInfo;
  config: ProfessionWeaponConfig;
  items: InventoryItem[];
  onClose: () => void;
};

export function ProfessionDetail({
  profession,
  config,
  items,
  onClose,
}: Props) {
  const {
    selectedIndex,
    message,
    isTierOwned,
    getHighestOwnedTierIndex,
    canCraftTier,
  } = useProfessionDetail({ profession, config, onClose });

  const listRef = useRef<HTMLDivElement | null>(null);
  const highestOwned = getHighestOwnedTierIndex();

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selectedIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex]);

  const selectedTier = PROFESSION_WEAPON_TIERS[selectedIndex]!;
  const weaponId = getProfessionWeaponId(config, selectedTier.id);
  const equipment = getEquipmentById(weaponId);
  const rankColor = RANK_COLORS[selectedTier.rank];

  function getMatOwned(id: string): number {
    const found = items.find((i) => i.id === (id as ItemId));
    return found?.qty ?? 0;
  }

  function renderMaterialList(tierIndex: number) {
    if (tierIndex === 0) {
      return Object.entries(profession.recipe).map(([id, qty]) => {
        const def = ITEMS[id as keyof typeof ITEMS];
        const name = def?.name ?? id;
        const image =
          def && "image" in def
            ? (def as { image: string }).image
            : null;
        const needed = qty ?? 1;
        const owned = getMatOwned(id);
        return (
          <div key={id} className={styles.materialRow}>
            {image && (
              <img
                className={styles.materialImg}
                src={asset(image)}
                alt={name}
              />
            )}
            <span className={styles.materialName}>{name}</span>
            <span
              className={`${styles.materialQty} ${
                owned >= needed ? styles.matEnough : styles.matMissing
              }`}
            >
              {owned}/{needed}
            </span>
          </div>
        );
      });
    }

    const prevTier = PROFESSION_WEAPON_TIERS[tierIndex - 1];
    if (!prevTier) return null;
    const matDef = ITEMS[config.materialId as keyof typeof ITEMS];
    const matImage =
      matDef && "image" in matDef
        ? (matDef as { image: string }).image
        : null;
    const matOwned = getMatOwned(config.materialId);
    const matNeeded = prevTier.materialQty;

    return (
      <div className={styles.materialRow}>
        {matImage && (
          <img
            className={styles.materialImg}
            src={asset(matImage)}
            alt={config.materialName}
          />
        )}
        <span className={styles.materialName}>{config.materialName}</span>
        <span
          className={`${styles.materialQty} ${
            matOwned >= matNeeded ? styles.matEnough : styles.matMissing
          }`}
        >
          {matOwned}/{matNeeded}
        </span>
      </div>
    );
  }

  function renderStats() {
    if (!equipment) return null;
    const entries = Object.entries(equipment.stats).filter(
      ([, v]) => typeof v === "number" && v !== 0,
    );
    if (entries.length === 0) return null;
    return (
      <div className={styles.statsBlock}>
        {entries.map(([key, value]) => (
          <div key={key} className={styles.statRow}>
            <span className={styles.statLabel}>
              {STAT_LABELS[key] ?? key}
            </span>
            <span className={styles.statValue}>{value}</span>
          </div>
        ))}
      </div>
    );
  }

  const owned = isTierOwned(selectedIndex);
  const craftable = canCraftTier(selectedIndex);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>
        <span>{config.baseName}</span>
        <button className={styles.backBtn} onClick={onClose}>
          ← Voltar
        </button>
      </h3>

      <div className={styles.panels}>
        <div className={styles.leftPanel}>
          <div className={styles.tierList} ref={listRef}>
            {PROFESSION_WEAPON_TIERS.map((tier, index) => {
              const tierOwned = isTierOwned(index);
              const isSelected = index === selectedIndex;
              const isMaxOwned = index <= highestOwned;
              const color = RANK_COLORS[tier.rank];

              return (
                <div
                  key={tier.id}
                  className={`${styles.tierItem} ${
                    isSelected ? styles.tierSelected : ""
                  }`}
                  style={{
                    borderLeftColor: isMaxOwned ? color : "transparent",
                  }}
                >
                  <div
                    className={styles.tierDot}
                    style={{ background: isMaxOwned ? color : undefined }}
                  />
                  <div className={styles.tierInfo}>
                    <span
                      className={styles.tierName}
                      style={{ color: isMaxOwned ? color : undefined }}
                    >
                      {config.baseName} {tier.label}
                    </span>
                    <span className={styles.tierRank}>
                      Ranque {RANK_LABELS[tier.rank]}
                    </span>
                  </div>
                  {tierOwned && (
                    <span className={styles.ownedBadge}>★</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.detailHeader}>
            <img
              className={styles.detailIcon}
              src={asset(professionIcon(profession.id))}
              alt=""
            />
            <div>
              <span className={styles.detailName} style={{ color: rankColor }}>
                {config.baseName} {selectedTier.label}
              </span>
              <span className={styles.detailRank}>
                Ranque {RANK_LABELS[selectedTier.rank]}
              </span>
            </div>
          </div>

          <div className={styles.bonusSection}>
            <div className={styles.bonusRow}>
              <span className={styles.bonusLabel}>
                Bônus vs {config.element}
              </span>
              <span className={styles.bonusValue}>
                +{(selectedTier.damageBonus * 100).toFixed(0)}%
              </span>
            </div>
            <div className={styles.bonusRow}>
              <span className={styles.bonusLabel}>Chance de material</span>
              <span className={styles.bonusValue}>
                {(selectedTier.materialDrop * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {renderStats()}

          <div className={styles.craftSection}>
            <span className={styles.craftTitle}>
              {selectedIndex === 0
                ? "Materiais para craftar"
                : "Material de upgrade"}
            </span>
            <div className={styles.materialsList}>
              {renderMaterialList(selectedIndex)}
            </div>
          </div>

          <div className={styles.actionRow}>
            {owned ? (
              <span className={styles.statusOwned}>★ Obtida</span>
            ) : craftable ? (
              <span className={styles.statusCraftable}>
                {selectedIndex === 0 ? "Craftar" : "Evoluir"}
              </span>
            ) : (
              <span className={styles.statusLocked}>Falta material</span>
            )}
          </div>
        </div>
      </div>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}

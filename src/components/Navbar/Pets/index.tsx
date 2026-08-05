import { useRef } from "react";
import { Star } from "lucide-react";
import { npcPath } from "@/utils/paths";
import { RANK_COLORS, RANK_LABELS } from "@/utils/types/player/equipment";
import { PET_STAR_MAX } from "@/data/characters/petProgress";
import { usePetsMenu } from "@/hooks/menu/pets/usePetsMenu";
import styles from "./styles.module.css";

export function Pets() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const {
    ownedPets,
    equippedId,
    selectedIndex,
    pendingStar,
    activeStar,
    highestEligibleStar,
    statsFor,
  } = usePetsMenu(true, listRef);

  if (ownedPets.length === 0) {
    return (
      <div className="containerOfNavbar">
        <h2>Pets</h2>
        <p className={styles.emptyText}>
          Você ainda não possui pets. Encontre-os em baús ou derrotando
          inimigos.
        </p>
      </div>
    );
  }

  return (
    <div className="containerOfNavbar">
      <h2>Pets</h2>
      <div className={styles.container} ref={listRef}>
        {ownedPets.map((entry, index) => {
          const isSelected = index === selectedIndex;
          const isEquipped = equippedId === entry.id;
          const stars = activeStar(entry);
          const stats = statsFor(entry);
          const eligible = highestEligibleStar(entry);
          const canFuse = eligible > 0;
          const isFusing = isSelected && pendingStar !== 0;
          const petNpcType = entry.id.replace("pet_", "");

          return (
            <div
              key={entry.id}
              className={`${styles.petCard} ${
                isSelected ? styles.selected : ""
              } ${isEquipped ? styles.equipped : ""}`}
            >
              <div className={styles.cardTop}>
                <div className={styles.imageBox}>
                  <img
                    src={npcPath(`/${petNpcType}/default.svg`)}
                    alt={entry.name}
                    className={styles.petImage}
                    onError={(e) => {
                      e.currentTarget.src = npcPath("/goat/default.svg");
                    }}
                  />
                </div>
                <div className={styles.info}>
                  <div className={styles.nameRow}>
                    <span
                      className={styles.name}
                      style={{ color: RANK_COLORS[entry.rank] }}
                    >
                      {entry.name}
                    </span>
                    <span
                      className={styles.rankLabel}
                      style={{ color: RANK_COLORS[entry.rank] }}
                    >
                      {RANK_LABELS[entry.rank]}
                    </span>
                  </div>
                  <div className={styles.starsRow}>
                    {Array.from({ length: PET_STAR_MAX }, (_, i) => {
                      const star = i + 1;
                      const qty = entry.qtyByStar[i];
                      const isActive = isSelected && star === stars;
                      const isEligible =
                        qty >= 2 && star < PET_STAR_MAX && isActive;
                      return (
                        <div
                          key={star}
                          className={`${styles.starChip} ${
                            isActive ? styles.starChipActive : ""
                          } ${isEligible ? styles.starChipEligible : ""}`}
                        >
                          <Star
                            size={14}
                            className={
                              qty > 0 ? styles.starFilled : styles.starEmpty
                            }
                          />
                          {qty > 0 && (
                            <span className={styles.starQty}>x{qty}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.statsLine}>
                    Nv.{stats.level} — HP: {stats.maxHp} | Dano: {stats.damage}
                  </div>
                </div>
              </div>

              <div className={styles.cardBottom}>
                {isSelected && canFuse && (
                  <span
                    className={`${styles.fuseBadge} ${
                      isFusing ? styles.fuseConfirm : ""
                    }`}
                  >
                    {isFusing ? "CONFIRMAR FUSÃO?" : `FUNDIR (2x ★${eligible})`}
                  </span>
                )}
                {isEquipped && (
                  <span className={styles.equippedBadge}>Equipado</span>
                )}
                {!isEquipped && (
                  <span className={styles.hint}>
                    {isSelected && canFuse
                      ? "Confirmar: fundir"
                      : "←/→: trocar estrela"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

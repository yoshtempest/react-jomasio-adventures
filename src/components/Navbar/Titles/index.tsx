import styles from "./styles.module.css";
import { useTitleMenu } from "@/hooks/menu/useTitleMenu";
import { useTitles } from "@/contexts/TitleContext";
import { TITLES } from "@/data/titles";

const ICON_MAP: Record<string, string> = {
  skull: "💀",
  goat: "🐐",
  cultist: "🗡️",
  rare: "💎",
  boss: "👑",
  legendary: "⭐",
  warrior: "⚔️",
};

const STAT_LABEL: Record<string, string> = {
  damage: "Dano",
  hp: "HP",
  strength: "Força",
  intelligence: "Inteligência",
};

export function TitlesScreen() {
  const { titlesData } = useTitles();
  const { titleIds, selectedIndex, equippedId } = useTitleMenu(true);

  return (
    <div className="containerOfNavbar">
      <h2>Títulos</h2>

      <div className={styles.container}>
        {titleIds.map((id, index) => {
          const def = TITLES[id];
          const progress = titlesData.progress[id];
          if (!def || !progress) return null;

          const isSelected = index === selectedIndex;
          const isUnlocked = progress.unlocked;
          const isEquipped = equippedId === id;
          const pct = Math.min(100, (progress.current / def.condition.count) * 100);

          return (
            <div
              key={id}
              className={`${styles.titleCard} ${
                isSelected ? styles.selected : ""
              } ${
                isUnlocked
                  ? isEquipped
                    ? styles.titleCardEquipped
                    : styles.titleCardUnlocked
                  : styles.titleCardLocked
              }`}
            >
              <div className={styles.iconBox}>
                {ICON_MAP[def.icon] ?? "🏆"}
              </div>

              <div className={styles.info}>
                <div className={styles.titleName}>
                  {def.name}
                </div>

                <div className={styles.titleDesc}>
                  {def.description}
                </div>

                {def.bonus.length > 0 && (
                  <div className={styles.bonusText}>
                    {def.bonus.map((b) => `${STAT_LABEL[b.stat] ?? b.stat} +${b.value}`).join(", ")}
                  </div>
                )}

                {!isUnlocked && (
                  <>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className={styles.progressText}>
                      {progress.current}/{def.condition.count}
                    </div>
                  </>
                )}
              </div>

              {isUnlocked && isEquipped && (
                <span className={styles.equipBadge}>Equipado</span>
              )}
              {isUnlocked && !isEquipped && (
                <span className={styles.equipButton}>Equipar</span>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.hintText}>
        Confirmar: equipar/remover título
      </div>
    </div>
  );
}

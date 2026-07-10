import { useRef } from "react";
import styles from "./styles.module.css";
import { useBestiaryMenu } from "@/hooks/menu/useBestiary";
import { useBestiary } from "@/contexts/BestiaryContext";
import { BESTIARY_DATA } from "@/data/bestiary";
import { asset } from "@/utils/paths";
import { CLASS_DATA } from "@/data/npc/class";
import { getNpcClass, getLinkedTitles, getDropItems } from "@/gameRules/npc/bestiary";


export function DeliciaDex() {
  const { hasEncountered, getKills, bestiary } = useBestiary();
  const listRef = useRef<HTMLDivElement | null>(null);
  const { selectedIndex, npcIds } = useBestiaryMenu(true, listRef);

  const encounteredCount = npcIds.filter((id) => bestiary[id]?.encountered).length;

  return (
    <div className="containerOfNavbar">
      <div className={styles.flexRow}>
        <h2>DelíciaDex</h2>

        <div className={styles.counter}>
          {encounteredCount}/{npcIds.length} encontrados
        </div>
      </div>

      <div className={styles.container} ref={listRef}>
        {npcIds.map((npcType, index) => {
          const entry = BESTIARY_DATA[npcType];
          if (!entry) return null;

          const encountered = hasEncountered(npcType);
          const kills = getKills(npcType);
          const isSelected = index === selectedIndex;
          const npcClass = getNpcClass(npcType);
          const linkedTitles = encountered && npcClass ? getLinkedTitles(npcType, npcClass) : [];
          const dropItems = encountered && npcClass ? getDropItems(npcClass, npcType) : [];

          return (
            <div
              key={npcType}
              className={`${styles.card} ${
                isSelected ? styles.selected : ""
              } ${encountered ? styles.cardEncountered : styles.cardUnknown}`}
            >
              <div className={styles.spriteBox}>
                <img
                  src={asset(`/assets/npcs/${npcType}/default.svg`)}
                  alt={entry.name}
                  className={`${styles.sprite} ${
                    encountered ? "" : styles.silhouette
                  }`}
                  onError={(e) => {
                    const img = e.currentTarget;

                    if (img.dataset.fallback === "default") {
                      img.dataset.fallback = "walk";
                      img.src = asset(`/assets/npcs/${npcType}/walk.svg`);
                    } else if (img.dataset.fallback === "walk") {
                      img.dataset.fallback = "right";
                      img.src = asset(`/assets/npcs/${npcType}/right.svg`);
                    }
                  }}
                  data-fallback="default"
                />
              </div>

              <div className={styles.info}>
                {encountered ? (
                  <>
                    <div className={styles.name}>{entry.name}</div>

                    <div className={styles.metaRow}>
                      {npcClass && (
                        <span
                          className={styles.classBadge}
                          style={{ color: CLASS_DATA[npcClass].color }}
                        >
                          {CLASS_DATA[npcClass].label}
                        </span>
                      )}
                      <span className={styles.killCount}>
                        {kills} {kills === 1 ? "vez" : "vezes"} derrotado
                      </span>
                    </div>

                    <div className={styles.location}>{entry.location}</div>
                    <div className={styles.description}>
                      {entry.description}
                    </div>

                    <div className={styles.attacks}>
                      {entry.attacks.map((attack) => (
                        <span key={attack} className={styles.attackTag}>
                          {attack}
                        </span>
                      ))}
                    </div>

                    {dropItems.length > 0 && (
                      <div className={styles.section}>
                        <div className={styles.sectionTitle}>Drops</div>
                        <div className={styles.dropGrid}>
                          {dropItems.map((drop) => (
                            <span key={drop.name} className={styles.dropTag}>
                              {drop.name}
                              <span className={styles.dropChance}>
                                {drop.chance}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {linkedTitles.length > 0 && (
                      <div className={styles.section}>
                        <div className={styles.sectionTitle}>Títulos</div>
                        <div className={styles.titleList}>
                          {linkedTitles.map((titleName) => {
                            return (
                              <span key={titleName} className={styles.titleTag}>
                                {titleName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className={styles.unknownName}>???</div>
                      {npcClass && (
                        <span
                          className={styles.classBadge}
                          style={{ color: CLASS_DATA[npcClass].color }}
                        >
                          {CLASS_DATA[npcClass].label}
                        </span>
                      )}
                    <div className={styles.unknownHint}>
                      Derrote este inimigo para descobrir mais
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

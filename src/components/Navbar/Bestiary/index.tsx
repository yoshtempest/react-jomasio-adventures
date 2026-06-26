import { useRef } from "react";
import styles from "./styles.module.css";
import { useBestiaryMenu } from "@/hooks/menu/useBestiary";
import { useBestiary } from "@/contexts/BestiaryContext";
import { BESTIARY_DATA } from "@/data/bestiary";
import { NPCS } from "@/data/npc";
import { TITLES } from "@/data/titles";
import { CRAFT_DROP_TABLES } from "@/data/items/crafting";
import { DROP_CONFIG } from "@/data/equipment/drops";
import { COIN_REWARDS, CHEST_DROP_CHANCE, KEY_DROP_CHANCE } from "@/hooks/battle/rewards/useRewards";
import { ITEMS } from "@/data/items";
import { asset } from "@/utils/asset";

const CLASS_LABEL: Record<string, string> = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  boss: "Chefão",
  legendary: "Lendário",
};

const CLASS_COLOR: Record<string, string> = {
  common: "#9d9d9d",
  rare: "#50c878",
  epic: "#b44aff",
  boss: "#e0115f",
  legendary: "#ff4500",
};

function getNpcClass(npcType: string): string | null {
  return NPCS[npcType]?.class ?? null;
}

function getLinkedTitles(npcType: string, npcClass: string): string[] {
  const linked: string[] = [];
  for (const titleId of Object.keys(TITLES)) {
    const def = TITLES[titleId];
    if (!def) continue;
    if (def.condition.type === "killNpcType" && npcType.startsWith(def.condition.npcTypePrefix)) {
      linked.push(def.name);
    } else if (def.condition.type === "killNpcClass" && npcClass === def.condition.npcClass) {
      linked.push(def.name);
    } else if (def.condition.type === "killTotal") {
      linked.push(def.name);
    }
  }
  return linked;
}

function getDropItems(npcClass: string, npcType: string) {
  const drops: { name: string; chance: string }[] = [];

  const coinAmount = COIN_REWARDS[npcClass];
  if (coinAmount) {
    drops.push({ name: `${coinAmount} moedas por nível`, chance: "Sempre" });
  }

  const craftTable = CRAFT_DROP_TABLES[npcClass];
  if (craftTable) {
    for (const entry of craftTable.always) {
      const item = ITEMS[entry.id as keyof typeof ITEMS];
      if (item) {
        drops.push({ name: item.name, chance: `${(entry.chance * 100).toFixed(0)}%` });
      }
    }
    if (craftTable.perNpcType) {
      const typeDrops = craftTable.perNpcType[npcType];
      if (typeDrops) {
        for (const entry of typeDrops) {
          const item = ITEMS[entry.id as keyof typeof ITEMS];
          if (item) {
            drops.push({ name: item.name, chance: `${(entry.chance * 100).toFixed(0)}%` });
          }
        }
      }
    }
  }

  const dropConfig = DROP_CONFIG[npcClass as NPCClass];
  if (dropConfig) {
    drops.push({ name: "Equipamentos", chance: `${(dropConfig.baseChance * 100).toFixed(0)}%` });
  }

  const chestChance = CHEST_DROP_CHANCE[npcClass as NPCClass];
  if (chestChance) {
    const chestItem = ITEMS[`${npcClass}_chest` as keyof typeof ITEMS];
    if (chestItem) {
      drops.push({ name: chestItem.name, chance: `${(chestChance * 100).toFixed(0)}%` });
    }
  }

  const keyChance = KEY_DROP_CHANCE[npcClass as NPCClass];
  if (keyChance) {
    const keyItem = ITEMS[`${npcClass}_key` as keyof typeof ITEMS];
    if (keyItem) {
      drops.push({ name: keyItem.name, chance: `${(keyChance * 100).toFixed(0)}%` });
    }
  }

  if (npcType.startsWith("goat")) {
    drops.push({ name: "Bodão (pet)", chance: "1%" });
  }

  return drops;
}

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
                          style={{ color: CLASS_COLOR[npcClass] }}
                        >
                          {CLASS_LABEL[npcClass]}
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
                          style={{ color: CLASS_COLOR[npcClass] }}
                        >
                          {CLASS_LABEL[npcClass]}
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

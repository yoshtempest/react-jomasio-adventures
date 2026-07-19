import { useRef } from "react";
import styles from "./styles.module.css";
import { useBestiaryMenu } from "@/hooks/menu/useBestiary";
import { useBestiary } from "@/contexts/BestiaryContext";
import { BESTIARY_DATA } from "@/data/bestiary";
import { getNpcClass, getLinkedTitles, getDropItems } from "@/gameRules/npc/bestiary";
import { BestiaryCard } from "./Card";


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
            <BestiaryCard
              key={npcType}
              npcType={npcType}
              name={entry.name}
              encountered={encountered}
              kills={kills}
              npcClass={npcClass}
              location={entry.location}
              description={entry.description}
              attacks={entry.attacks}
              dropItems={dropItems}
              linkedTitles={linkedTitles}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
}

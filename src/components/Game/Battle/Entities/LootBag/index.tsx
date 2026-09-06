import { LOOTBAG_SPRITES } from "@/data/battle/lootbags";
import { ITEMS } from "@/data/items";
import { asset } from "@/utils/paths";
import type { BattleLootBag } from "@/utils/types/battle/loot";

import styles from "./styles.module.css";

type Props = {
  bag: BattleLootBag;
  TILE_SIZE: number;
  npcClass: NPCClass;
};

function bagBadgeIcon(bag: BattleLootBag): string | null {
  if (bag.contents.hyperCoins > 0) {
    return ITEMS.hypercoin.image;
  }
  if (bag.contents.chestDrop) {
    const chest = ITEMS[bag.contents.chestDrop.id];
    return chest?.image ?? null;
  }
  if (bag.contents.coins > 0) {
    return ITEMS.kwanzas.image;
  }
  const item = bag.contents.itemDrops[0];
  if (item && item.image) return item.image;
  return null;
}

export function LootBag({ bag, TILE_SIZE, npcClass }: Props) {
  const scaleX = window.innerWidth / 1000;
  const scaleY = window.innerHeight / 600;
  const badge = bagBadgeIcon(bag);

  return (
    <div
      className={styles.lootBag}
      style={{
        width: TILE_SIZE * 0.8,
        height: TILE_SIZE * 0.8,
        left: bag.x * scaleX,
        top: bag.y * scaleY,
        transform: "translate(-50%, -100%)",
        zIndex: 8,
      }}
    >
      <img
        className={styles.sprite}
        src={asset(LOOTBAG_SPRITES[npcClass])}
        alt="Lootbag"
      />
      {badge && (
        <img className={styles.badge} src={asset(badge)} alt="item" />
      )}
    </div>
  );
}
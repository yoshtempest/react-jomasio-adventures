import { asset } from "@/utils/paths";

import styles from "./styles.module.css";

const LOOTBAG_SPRITE = "/assets/items/lootBag/common.svg";

type Props = {
  gridX: number;
  gridY: number;
  tileSize: number;
};

export function LootBag({ gridX, gridY, tileSize }: Props) {
  return (
    <img
      className={styles.lootBag}
      src={asset(LOOTBAG_SPRITE)}
      alt="Saco de loot"
      style={{
        left: gridX * tileSize,
        top: gridY * tileSize,
        width: tileSize,
        height: tileSize,
      }}
    />
  );
}

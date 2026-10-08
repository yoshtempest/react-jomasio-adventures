import { memo } from "react";
import { lootBagPath } from "@/utils/paths";

import styles from "./styles.module.css";

const LOOTBAG_SPRITE = lootBagPath("common.svg");

type Props = {
  gridX: number;
  gridY: number;
  tileSize: number;
};

/** Props primitivas + cena que re-renderiza por passo: `memo` barato. */
export const LootBag = memo(function LootBag({
  gridX,
  gridY,
  tileSize,
}: Props) {
  return (
    <img
      className={styles.lootBag}
      src={LOOTBAG_SPRITE}
      alt="Saco de loot"
      style={{
        left: gridX * tileSize,
        top: gridY * tileSize,
        width: tileSize,
        height: tileSize,
      }}
    />
  );
});

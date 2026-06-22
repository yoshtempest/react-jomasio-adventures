import styles from "./styles.module.css";

type QuestArrowProps = {
  x: number;
  y: number;
  TILE_SIZE: number;
};

export function QuestArrow({ x, y, TILE_SIZE }: QuestArrowProps) {
  return (
    <div
      className={styles.arrow}
      style={{
        left: x * TILE_SIZE + TILE_SIZE / 2 - 10,
        top: y * TILE_SIZE - TILE_SIZE * 0.4,
        width: 20,
        height: 20,
      }}
    >
      ▲
    </div>
  );
}

type QuestNPCBadgeProps = {
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
};

export function QuestNPCBadge({ gridX, gridY, TILE_SIZE }: QuestNPCBadgeProps) {
  return (
    <div
      className={styles.badge}
      style={{
        left: gridX * TILE_SIZE - 40 + (TILE_SIZE * 1.7) / 2 - 10,
        top: gridY * TILE_SIZE - 48,
      }}
    >
      !
    </div>
  );
}

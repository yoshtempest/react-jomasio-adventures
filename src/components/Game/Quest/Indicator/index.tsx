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

type QuestDirectionArrowProps = {
  gridX: number;
  gridY: number;
  TILE_SIZE: number;
  PLAYER_SIZE: number;
  direction: Direction;
};

const DIRECTION_ROTATION: Record<Direction, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

const DIRECTION_OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

export function QuestDirectionArrow({
  gridX,
  gridY,
  TILE_SIZE,
  PLAYER_SIZE,
  direction,
}: QuestDirectionArrowProps) {
  const offset = DIRECTION_OFFSET[direction];
  const rotation = DIRECTION_ROTATION[direction];

  return (
    <div
      className={styles.directionArrow}
      style={{
        left: gridX * TILE_SIZE + PLAYER_SIZE / 2 + offset.x * (PLAYER_SIZE * 0.55) - 6,
        top: gridY * TILE_SIZE + PLAYER_SIZE / 2 + offset.y * (PLAYER_SIZE * 0.55) - 6,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      ▶
    </div>
  );
}

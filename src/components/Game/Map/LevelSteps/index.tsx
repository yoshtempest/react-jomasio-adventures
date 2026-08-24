import styles from "./styles.module.css";

type Props = {
  heightMap?: number[][];
  TILE_SIZE: number;
};

export function LevelSteps({ heightMap, TILE_SIZE }: Props) {
  if (!heightMap) return null;

  return (
    <>
      {heightMap.map((row, y) =>
        row.map((height, x) => {
          if (height <= 0) return null;

          return (
            <div
              key={`level-${x}-${y}`}
              className={styles.step}
              style={{
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
            >
              <span className={styles.label}>Degrau {height}</span>
            </div>
          );
        }),
      )}
    </>
  );
}

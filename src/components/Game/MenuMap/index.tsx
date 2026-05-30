import styles from "./styles.module.css"

type Props = {
  map: number[][];
  playerX: number;
  playerY: number;
};

export function MapOverlay({ map, playerX, playerY }: Props) {
  return (
    <div className={styles.mapOverlay}>
      <div className={styles.mapGrid} 
        style={{
            gridTemplateColumns: `repeat(${map[0].length}, 12px)`
        }}>
        {map.map((row, y) =>
          row.map((cell, x) => {
            let color = "#0A0500"; // 1

            if (cell === 0) color = "#d9d9d9";
            if (cell === 2) color = "#e1e1e1";

            // destaque NPC/2
            if (cell === 2) {
              color = "yellow";
            }

            // jogador
            if (x === playerX && y === playerY) {
              color = "red";
            }

            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: color,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
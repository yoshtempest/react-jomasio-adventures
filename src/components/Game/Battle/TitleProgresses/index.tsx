import styles from "./styles.module.css";
import { useTitles } from "@/contexts/TitleContext";
import { TITLES } from "@/data/titles";

export function TitleProgresses() {
  const { titlesData } = useTitles();

  const activeTitles = Object.entries(TITLES).filter(([id]) => {
    const p = titlesData.progress[id];
    return p && p.current > 0;
  });

  return (
    <div className="section">
      <h2 className="sectionTitle">
        Progresso de Títulos
        <span className={styles.totalKills}>
          Total de mortes: {titlesData.totalKills}
        </span>
      </h2>
      <div className={styles.list}>
        {activeTitles.length === 0 && (
          <span className={styles.noProgress}>
            Nenhum título em progresso ainda
          </span>
        )}
        {activeTitles.slice(0, 4).map(([id, def]) => {
          const prog = titlesData.progress[id];
          const levelDef = def.levels[prog.level];
          if (!levelDef) return null;
          return (
            <div key={id} className={styles.progress}>
              <span className={styles.name}>{def.name}</span>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${Math.min(100, (prog.current / levelDef.count) * 100)}%`,
                  }}
                />
              </div>
              <span className={styles.count}>
                {prog.current}/{levelDef.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

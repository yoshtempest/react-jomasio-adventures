import styles from "./styles.module.css";

const PROFESSIONS = [
  { profession: "Alquimista", name: "Val Val" },
  { profession: "Agricultor", name: "Cendeiro" },
  { profession: "Pescador", name: "???" },
  { profession: "Confeiteiro", name: "Jucimaria" },
  { profession: "Açougueiro", name: "Tim" },
  { profession: "BodyBuilder", name: "Franciane" },
  { profession: "Mecânico", name: "Binha" },
];

export function Professions() {
  return (
    <div className="containerOfNavbar">
      <h3 className={styles.header}>Profissões</h3>
      <ul className={styles.list}>
        {PROFESSIONS.map((p) => (
          <li key={p.profession} className={`${styles.item} ${styles.locked}`}>
            <div>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.profession}>{p.profession}</div>
            </div>
            <span className={styles.level}>Nv.1</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

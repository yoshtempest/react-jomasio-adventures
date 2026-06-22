import styles from "./styles.module.css";

type Props = {
  chestDrop: { id: string; name: string } | null;
  keyDrop: { id: string; name: string } | null;
};

export function ChestDrops({ chestDrop, keyDrop }: Props) {
  if (!chestDrop && !keyDrop) return null;

  return (
    <div className="section">
      <h2 className="sectionTitle">Baús e Chaves</h2>
      <div className="dropsList">
        {chestDrop && (
          <div className="dropItem">
            <span className={styles.dropIcon}></span>
            <span className="dropName">{chestDrop.name}</span>
          </div>
        )}
        {keyDrop && (
          <div className="dropItem">
            <span className={styles.dropIcon}></span>
            <span className="dropName">{keyDrop.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

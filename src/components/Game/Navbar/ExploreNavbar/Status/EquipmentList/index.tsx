import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { EQUIPMENT_SLOTS, RANK_COLORS } from "@/data/equipment/definitions";
import styles from "./styles.module.css";
import { equipmentIconPath } from "@/utils/paths";
import { FILTER_LABELS } from "@/utils/equipment/equipmentMenu";

export function EquipmentList() {
  const { player } = usePlayer();
  const character = player.character;
  const { getEquippedItem } = useEquipment();

  return (
    <div className="StatusColumn">
      <div className="statusMainContainer">
        <div className="statusHeader">
          <img src={equipmentIconPath("all.svg")} />
          <h2 className="StatusTitle">Equipamentos</h2>
        </div>
        <button className="statusButton">Ver equipamentos</button>
      </div>
      <div className={styles.equipmentGrid}>
        {EQUIPMENT_SLOTS.map((slot) => {
          const item = getEquippedItem(character, slot);
          return (
            <p key={slot} className={styles.fontSize}>
              <img className="slotTag" src={FILTER_LABELS[slot]} />
              {item ? (
                <span style={{ color: RANK_COLORS[item.rank] }}>{item.name}</span>
              ) : (
                <span className={styles.italic}>Vazio</span>
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

import { HealthBar } from "@/components/Game/Battle/HUD/HealthBar";
import { npcPath } from "@/utils/paths";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import styles from "../styles.module.css";
import { formatRank, getRank } from "@/gameRules/rank";

type Props = {
  npcType: string;
  npcLevel?: number;
  npcHP: number;
  npcMaxHp: number;
};

export function NPCHUDPanel({ npcType, npcLevel, npcHP, npcMaxHp }: Props) {
  return (
    <div className={styles.container} style={{ right: 10, top: 10 }}>
      <div className={styles.npcInfo}>
        <h2 className={styles.name}>{getNpcDisplayName(npcType)}</h2>
        {npcLevel !== undefined && (
          <p className={styles.npcRank}>
            {formatRank(getRank(npcLevel))}
          </p>
        )}

        <HealthBar hp={npcHP} maxHp={npcMaxHp} reversed />
      </div>
      <img
        src={npcPath(`/${npcType}/face.svg`)}
        alt="Npc HUD"
        className={styles.image}
      />
    </div>
  );
}

import { HealthBar } from "@/components/Game/HealthBar";
import { Deliciometro } from "@/components/Game/Deliciometro";
import { asset } from "@/utils/asset";
import styles from "./styles.module.css";


type Props = {
  battle: any;
  npcStats: any;
};

export function BattleHUD({ battle, npcStats }: Props) {
  return (
    <>
      <div className={styles.container} style={{ left: 10, top: 10 }}>
        <img
          src={asset(`/assets/player/eduarda/default.svg`)}
          alt="Battle HUD"
          className={styles.image}
        />

        <div style={{ position: "absolute", top: 0, left: 80 }}>
          <h2 className={styles.playerName}>Nome de usuário</h2>
          <div className={styles.flexRow}>
            <HealthBar hp={battle.playerHP} maxHp={battle.playerMaxHp} />
            <Deliciometro
              delicia={battle.delicia}
              hitsToSpecial={battle.hitsToSpecial}
            />
          </div>
        </div>
      </div>

      <div className={styles.container} style={{ right: 10, top: 10 }}>
        <div style={{ position: "absolute", top: 0, right: 80 }}>
          <h2 className={styles.name}>Npc Type Convertido</h2>
          <div style={{ transform: "scaleX(-1)" }}>
            <HealthBar hp={battle.npcHP} maxHp={npcStats.hp} />
          </div>
        </div>
        <img
          src={asset(`/assets/npcs/slimita/slime.svg`)}
          alt="Battle HUD"
          className={styles.image}
        />
      </div>
    </>
  );
}
import { HealthBar } from "@/components/Game/HealthBar";
import { Deliciometro } from "@/components/Game/Deliciometro";
import { BlockGauge } from "@/components/Game/BlockGauge";
import { asset } from "@/utils/asset";
import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import type { SummonedNpc } from "@/utils/types/npc/npc";

type BattleHUDState = {
  playerHP: number;
  playerMaxHp: number;
  npcHP: number;
  delicia: number;
  hitsToSpecial: number;
  blockLimit: number;
};

type NpcStats = {
  hp: number;
  damage: number;
};

type Props = {
  battle: BattleHUDState;
  npcStats: NpcStats;
  npcType?: string;
  summons?: SummonedNpc[];
};

export function BattleHUD({ battle, npcStats, npcType, summons }: Props) {
  const { player } = usePlayer();
  const playerName = localStorage.getItem("playerName") || "Protagonista";
  return (
    <>
      <div className={styles.container} style={{ left: 10, top: 10 }}>
        <img
          src={asset(`/assets/player/${player.character}/face.svg`)}
          alt="Player HUD"
          className={styles.image}
        />
        <div style={{ position: "absolute", top: 0, left: 80 }}>
          <h2 className={styles.playerName}>{playerName}</h2>

          <div className={styles.flexRow}>
            <div>
              <HealthBar hp={battle.playerHP} maxHp={battle.playerMaxHp} />
              <BlockGauge
                blockLimit={battle.blockLimit}
                isBlocking={player.state === "blocked"}
              />
            </div>
            <Deliciometro
              delicia={battle.delicia}
              hitsToSpecial={battle.hitsToSpecial}
            />
          </div>
        </div>
      </div>

      {npcType && (
        <div className={styles.container} style={{ right: 10, top: 10 }}>
          <div style={{ position: "absolute", top: 0, right: 80 }}>
            <h2 className={styles.name}>{npcType}</h2>

            <HealthBar hp={battle.npcHP} maxHp={npcStats.hp} reversed />
          </div>
          <img
            src={asset(`/assets/npcs/${npcType}/face.svg`)}
            alt="Npc HUD"
            className={styles.image}
          />
        </div>
      )}

      {summons &&
        summons.length > 0 &&
        summons
          .filter((s) => s.hp > 0)
          .map((s, i) => (
            <div
              key={s.id}
              className={styles.container}
              style={{ right: 10, top: 10 + (i + 1) * 100 }}
            >
              <div style={{ position: "absolute", top: 0, right: 80 }}>
                <h2 className={styles.name}>{s.npcType}</h2>
                <HealthBar hp={s.hp} maxHp={s.maxHp} reversed />
              </div>
              <img
                src={asset(`/assets/npcs/${s.npcType}/face.svg`)}
                alt={`${s.npcType} HUD`}
                className={styles.image}
              />
            </div>
          ))}
    </>
  );
}

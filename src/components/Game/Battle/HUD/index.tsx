import { HealthBar } from "@/components/Game/HealthBar";
import { Deliciometro } from "@/components/Game/Deliciometro";
import { BlockGauge } from "@/components/Game/BlockGauge";
import { asset } from "@/utils/asset";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import type { SummonedNpc } from "@/utils/types/npc/npc";
import { getRank, formatRank } from "@/gameRules/rank";

type BattleHUDState = {
  playerHP: number;
  playerMaxHp: number;
  playerShield: number;
  npcHP: number;
  delicia: number;
  hitsToSpecial: number;
  blockGauge: number;
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
  npcLevel?: number;
  summons?: SummonedNpc[];
};

export function BattleHUD({ battle, npcStats, npcType, npcLevel, summons }: Props) {
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const playerName = localStorage.getItem("playerName") || "Protagonista";
  const playerRank = formatRank(getRank(progress[player.character]?.level ?? 1));
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
          <p className={styles.playerRank}>{playerRank}</p>

          <div className={styles.flexRow}>
            <div>
              <HealthBar hp={battle.playerHP} maxHp={battle.playerMaxHp} />
              {battle.playerShield > 0 && (
                <div
                  style={{
                    width: 200,
                    height: 6,
                    background: "#555",
                    borderRadius: 2,
                    overflow: "hidden",
                    marginTop: 2,
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, (battle.playerShield / battle.playerMaxHp) * 100)}%`,
                      height: "100%",
                      background: "#e0e0e0",
                      transition: "width 0.2s",
                    }}
                  />
                </div>
              )}
              <BlockGauge
                blockGauge={battle.blockGauge}
                blockLimit={battle.blockLimit}
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
            <h2 className={styles.name}>{getNpcDisplayName(npcType)}</h2>
            {npcLevel !== undefined && (
              <p className={styles.npcRank}>
                {formatRank(getRank(npcLevel))}
              </p>
            )}

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
                <h2 className={styles.name}>{getNpcDisplayName(s.npcType)}</h2>
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

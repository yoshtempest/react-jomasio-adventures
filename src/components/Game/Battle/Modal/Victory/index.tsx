import styles from "./styles.module.css";
import { asset } from "@/utils/asset";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import { useVictoryVisibility } from "@/hooks/battle/victory/useVisibility";
import { useVictoryKeyboard } from "@/hooks/battle/victory/useKeyboard";
import { RewardCards } from "@/components/Game/Battle/RewardCards";
import { EquipmentDrops } from "@/components/Game/Battle/Drops/Equipment";
import { ItemDrops } from "@/components/Game/Battle/Drops/Item";
import { ChestDrops } from "@/components/Game/Battle/Drops/Chest";
import { TitleProgresses } from "@/components/Game/Battle/TitleProgresses";
import { getRank, formatRank } from "@/gameRules/rank";
import { useActivePotion } from "@/hooks/useActivePotion";

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

type Props = {
  isOpen: boolean;
  character: string;
  enemyType: string;
  enemyLevel: number;
  myLevel: number;
  nextLevelXp: number;
  onContinue: () => void;
  xpReward: number;
  rewards: RewardInfo | null;
  skipDelay?: boolean;
  elapsed: number;
  bestTime: number;
};

export function VictoryModal({
  isOpen,
  character,
  enemyType,
  enemyLevel,
  myLevel,
  nextLevelXp,
  onContinue,
  xpReward,
  rewards,
  skipDelay = false,
  elapsed,
  bestTime,
}: Props) {
  const isVisible = useVictoryVisibility(isOpen, skipDelay);
  useVictoryKeyboard(isVisible, onContinue);
  const activePotion = useActivePotion();

  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <div className={styles.header}>
          <img
            src={asset(`/assets/player/${character}/default.svg`)}
            alt={character}
            className={styles.characterImage}
          />
          <div>
            <h1>Vitória!</h1>
            <p>
              Você derrotou um {getNpcDisplayName(enemyType)} - nv.{enemyLevel}
            </p>
            <p className={styles.rankText}>
              NPC: {formatRank(getRank(enemyLevel))}
            </p>
          </div>
        </div>

        <div className={styles.flexRow}>
          <RewardCards
            myLevel={myLevel}
            xpReward={xpReward}
            nextLevelXp={nextLevelXp}
            coinReward={rewards?.coinReward ?? 0}
          />

          <div className={styles.flexColumn}>
            <div className={styles.timeSection}>
              <p className={styles.timeRow}>
                <span className={styles.timeLabel}>Tempo:</span>
                <span>{formatTime(elapsed)}</span>
              </p>
              <p className={styles.timeRow}>
                <span className={styles.timeLabel}>Melhor tempo:</span>
                <span>{bestTime > 0 ? formatTime(bestTime) : "0:00"}</span>
              </p>
            </div>
            {activePotion && (
              <div className={styles.potionSection}>
                <img
                  src={asset(activePotion.image)}
                  alt={activePotion.name}
                  className={styles.potionImage}
                />
                <span className={styles.potionName}>{activePotion.name}</span>
                <span className={styles.potionTimer}>
                  {formatTime(activePotion.remainingMs)}
                </span>
              </div>
            )}
            <EquipmentDrops equipmentDrops={rewards?.equipmentDrops ?? []} />
            <ItemDrops itemDrops={rewards?.itemDrops ?? []} />
            <ChestDrops
              chestDrop={rewards?.chestDrop ?? null}
              keyDrop={rewards?.keyDrop ?? null}
            />
            <TitleProgresses />
            <button className={styles.button} onClick={onContinue}>
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

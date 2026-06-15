import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useTitles } from "@/contexts/TitleContext";
import { asset } from "@/utils/asset";
import { TITLES } from "@/data/titles";
import { RANK_COLORS, RANK_LABELS, SLOT_LABELS } from "@/utils/types/player/equipment";
import type { RewardInfo } from "@/hooks/battle/useBattleRewards";

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
}: Props) {
  const { titlesData } = useTitles();
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  const hasPlayedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (isVisible && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      playSoundRef.current("win");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isVisible, isOpen]);
  
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key.toLowerCase() === "l") {
        onContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onContinue]);

  const activeTitles = Object.entries(TITLES).filter(([id]) => {
    const p = titlesData.progress[id];
    return p && p.current > 0;
  });

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
              Você derrotou um {enemyType} - nv.{enemyLevel}
            </p>
          </div>
        </div>
        <div className={styles.flexRow}>
          <div className={styles.rewardsGrid}>
            <div className={styles.rewardCard}>
              <span className={styles.rewardLabel}>Seu nível</span>
              <span className={styles.rewardValue}>{myLevel}</span>
            </div>
            <div className={styles.rewardCard}>
              <span className={styles.rewardLabel}>XP ganho</span>
              <span className={styles.rewardValue}>+{xpReward}</span>
            </div>
            <div className={styles.rewardCard}>
              <span className={styles.rewardLabel}>XP até nível</span>
              <span className={styles.rewardValue}>{nextLevelXp}</span>
            </div>
            <div className={styles.rewardCard}>
              <span className={styles.rewardLabel}>Moedas</span>
              <span className={styles.rewardValue}>+{rewards?.coinReward ?? 0}</span>
            </div>
          </div>
          <div className={styles.flexColumn}>
            {(rewards?.equipmentDrops ?? []).length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Equipamentos Dropados</h2>
                <div className={styles.dropsList}>
                  {rewards!.equipmentDrops.map((eq) => (
                    <div key={eq.id} className={styles.dropItem}>
                      <span
                        className={styles.dropRank}
                        style={{ color: RANK_COLORS[eq.rank] }}
                      >
                        {RANK_LABELS[eq.rank]}
                      </span>
                      <span className={styles.dropName}>
                        {eq.name}
                        {eq.enhance > 0 ? <span className={styles.enhanceBadge}>+{eq.enhance}</span> : null}
                      </span>
                      <span className={styles.dropSlot}>({SLOT_LABELS[eq.slot]})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(rewards?.itemDrops ?? []).length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Itens Coletados</h2>
                <div className={styles.dropsList}>
                  {rewards!.itemDrops.map((item) => (
                    <div key={item.id} className={styles.dropItem}>
                      <img
                        className={styles.dropIcon}
                        src={item.image ? `${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}` : `${import.meta.env.BASE_URL}assets/items/${item.id}.svg`}
                        alt={item.name}
                      />
                      <span className={styles.dropName}>{item.name}</span>
                      <span className={styles.dropQty}>x{item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Progresso de Títulos
                <span className={styles.totalKills}>
                  Total de mortes: {titlesData.totalKills}
                </span>
              </h2>
              <div className={styles.titlesList}>
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
                    <div key={id} className={styles.titleProgress}>
                      <span className={styles.titleName}>{def.name}</span>
                      <div className={styles.titleBar}>
                        <div
                          className={styles.titleBarFill}
                          style={{
                            width: `${Math.min(100, (prog.current / levelDef.count) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className={styles.titleCount}>
                        {prog.current}/{levelDef.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <button className={styles.button} onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}
import { useRef, useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePassiveSkills } from "@/hooks/usePassiveSkills";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import styles from "./styles.module.css";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useTitles } from "@/contexts/TitleContext";
import { getTotalArmor, getWeaponCritRate } from "@/gameRules/battle/equipment";
import { getLuckBonus } from "@/gameRules/battle/luck";
import { calculateMaxHpBonus } from "@/gameRules/battle/damage";
import { asset } from "@/utils/paths";

export function AllStatsView() {
  const { player } = usePlayer();
  const { skills } = usePassiveSkills(player.character);
  const totalItems = skills.length;
  const character = player.character;
  const { progress } = useCharacterProgress();
  const { getTotalBonus } = useEquipment();
  const { getBonus } = useTitles();

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current.querySelector(
      `[data-index="${selectedIndex}"]`,
    ) as HTMLElement | null;
    if (!el) return;

    const container = containerRef.current;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const { scrollTop, clientHeight } = container;

    if (elTop < scrollTop) {
      container.scrollTop = elTop;
    } else if (elBottom > scrollTop + clientHeight) {
      container.scrollTop = elBottom - clientHeight;
    }
  }, [selectedIndex]);

  useGameControlsLayer(
    {
      onUp: () => setSelectedIndex((i) => Math.max(0, i - 1)),
      onDown: () => setSelectedIndex((i) => Math.min(totalItems - 1, i + 1)),
    },
    [totalItems],
  );
  
    const stats = progress[character]?.stats ?? {
      hp: 1,
      strength: 1,
      intelligence: 1,
      resistance: 1,
      tenacity: 1,
      luck: 1,
      points: 0,
    };
    const bonus = getTotalBonus(character);
    const titleBonus = getBonus();
  
    const totalHp = stats.hp + bonus.hp + titleBonus.hp;
    const totalStrength = stats.strength + bonus.strength + titleBonus.strength;
    const totalIntelligence =
      stats.intelligence + bonus.intelligence + titleBonus.intelligence;
  
    const userHp = 90 + totalHp * 10;
    const userSpecialDamage = 15 + totalIntelligence * 2;
    const userNormalAttackDamage = 6 + totalStrength;
    const userArmor = getTotalArmor(character, stats.resistance);
    const totalShield = bonus.shield + titleBonus.shield;
    const userTenacity = stats.tenacity + bonus.tenacity;
    const userLuck = (stats.luck ?? 1) + (bonus.luck ?? 0);
    const luckBonus = getLuckBonus(userLuck);
    const weaponCritRate = getWeaponCritRate(character);
    const critRate = 1 + weaponCritRate + luckBonus * 100;
    const missChance =
      (0.005 + (titleBonus.enemyMissChance ?? 0) / 100 + luckBonus) * 100;
    const totalMaxHpDamage = bonus.maxHpDamage ?? 0;
    const totalTrueDamage = bonus.trueDamage ?? 0;
    const maxHpDamageBonus = calculateMaxHpBonus(userHp, totalMaxHpDamage);
  
    const inc =
      selectedIndex !== undefined
        ? getStatIncreases(selectedIndex)
        : undefined;
  
    function getStatIncreases(index: number): Record<string, number> {
      switch (index) {
        case 0: return { hp: 10 };
        case 1: return { normalDmg: 1 };
        case 2: return { specialDmg: 2 };
        case 3: return { armor: 2, tenacity: 1 };
        case 4: {
          const currentLuck = (stats.luck ?? 1) + (bonus.luck ?? 0);
          const currentLuckBonus = getLuckBonus(currentLuck);
          const nextLuckBonus = getLuckBonus(currentLuck + 1);
          const diff = nextLuckBonus - currentLuckBonus;
          return {
            luck: 1,
            crit: Math.round(diff * 100 * 10) / 10,
            evade: Math.round(diff * 100 * 10) / 10,
          };
        }
        default: return {};
      }
    }
  
    return (
      <div className="containerOfNavbar" style={{ overflow: "hidden" }}>
        <div ref={containerRef} className={styles.containerMaster}>
          <div className={`StatusColumn ${styles.container}`}>
            <div className={`statusMainContainer ${styles.mainContainer}`}>
              <img src={asset("/assets/navbar/status.svg")} />
              <h2 className="StatusTitle">Status</h2>
            </div>
            <div>
              <div>
                <img src={asset("/assets/status/hp.svg")} />
                <p>
                  HP total: {userHp}
                  {inc?.hp ? <span className={styles.increase}> +{inc.hp}</span> : ""}
                </p>
              </div>
              <div>
                <img src={asset("/assets/status/basicDamage.svg")} />
                <p>
                  Dano normal: {userNormalAttackDamage}
                  {inc?.normalDmg ? <span className={styles.increase}> +{inc.normalDmg}</span> : ""}
                </p>
              </div>
              <div>
                <img src={asset("/assets/status/specialDamage.svg")} />
                <p>
                  Dano especial: {userSpecialDamage}
                  {inc?.specialDmg ? <span className={styles.increase}> +{inc.specialDmg}</span> : ""}
                </p>
              </div>
              <div>
                <img src={asset("/assets/status/armor.svg")} />
                <p>
                  Armadura: {userArmor}
                  {inc?.armor ? <span className={styles.increase}> +{inc.armor}</span> : ""}
                </p>
              </div>
              <div>
                <img src={asset("/assets/status/tenacity.svg")} />
                <p>
                  Tenacidade: {userTenacity}%
                  {inc?.tenacity ? <span className={styles.increase}> +{inc.tenacity}</span> : ""}
                </p>
              </div>
            </div>

            <div>
              <div>
                <img src={asset("/assets/status/luckChance.svg")} />
                <p>
                  Sorte: {userLuck}%
                  {inc?.luck ? <span className={styles.increase}> +{inc.luck}</span> : ""}
                </p>
              </div>
              <div>
                <img src={asset("/assets/status/critical.svg")} />
                <p>Crítico: {critRate.toFixed(1)}%
                {inc?.crit ? <span className={styles.increase}> +{inc.crit}</span> : ""}
                </p>
              </div>
              <div>
                <img src={asset("/assets/titlesBadges/enemyMissAttacks.svg")} />
                <p>
                  Esquiva: {missChance.toFixed(1)}%
                  {inc?.evade ? <span className={styles.increase}> +{inc.evade}</span> : ""}
                </p>
              </div>
              <div>
                <img src={asset("/assets/status/shield.svg")} />
                <p>Escudo: {totalShield}</p>
              </div>
              <div>
                <img src={asset("/assets/status/hp.svg")} />
                <p>Dano com base no HP: +{maxHpDamageBonus}</p>
              </div>
              <div>
                <img src={asset("/assets/status/basicDamage.svg")} />
                <p>Dano Verdadeiro: {totalTrueDamage}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
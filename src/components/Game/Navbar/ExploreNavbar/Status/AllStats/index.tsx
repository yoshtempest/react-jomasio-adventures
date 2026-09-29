import { useRef, useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePassiveSkills } from "@/hooks/usePassiveSkills";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import {
  getStatIncreases,
  useDerivedStats,
} from "@/hooks/player/useDerivedStats";
import styles from "./styles.module.css";
import { navbarIconPath, statusIconPath, titleBadgePath } from "@/utils/paths";

export function AllStatsView() {
  const { player } = usePlayer();
  const { skills } = usePassiveSkills(player.character);
  const totalItems = skills.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current.querySelector<HTMLElement>(
      `[data-index="${selectedIndex}"]`,
    );
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

  const derived = useDerivedStats();
  const inc =
    selectedIndex !== undefined
      ? getStatIncreases(selectedIndex, derived)
      : undefined;

  return (
    <div className="containerOfNavbar" style={{ overflow: "hidden" }}>
      <div ref={containerRef} className={styles.containerMaster}>
        <div className={`StatusColumn ${styles.container}`}>
          <div className={`statusMainContainer ${styles.mainContainer}`}>
            <img src={navbarIconPath("status.svg")} />
            <h2 className="StatusTitle">Status</h2>
          </div>
          <div>
            <div>
              <img src={statusIconPath("hp.svg")} />
              <p>
                HP total: {derived.hp}
                {inc?.hp ? (
                  <span className={styles.increase}> +{inc.hp}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div>
              <img src={statusIconPath("basicDamage.svg")} />
              <p>
                Dano normal: {derived.normalDmg}
                {inc?.normalDmg ? (
                  <span className={styles.increase}> +{inc.normalDmg}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div>
              <img src={statusIconPath("specialDamage.svg")} />
              <p>
                Dano especial: {derived.specialDmg}
                {inc?.specialDmg ? (
                  <span className={styles.increase}> +{inc.specialDmg}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div>
              <img src={statusIconPath("armor.svg")} />
              <p>
                Armadura: {derived.armor}
                {inc?.armor ? (
                  <span className={styles.increase}> +{inc.armor}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div>
              <img src={statusIconPath("tenacity.svg")} />
              <p>
                Tenacidade: {derived.tenacity}%
                {inc?.tenacity ? (
                  <span className={styles.increase}> +{inc.tenacity}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>

          <div>
            <div>
              <img src={statusIconPath("luckChance.svg")} />
              <p>
                Sorte: {derived.luck}%
                {inc?.luck ? (
                  <span className={styles.increase}> +{inc.luck}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div>
              <img src={statusIconPath("critical.svg")} />
              <p>
                Crítico: {derived.crit.toFixed(1)}%
                {inc?.crit ? (
                  <span className={styles.increase}> +{inc.crit}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div>
              <img src={titleBadgePath("enemyMissAttacks.svg")} />
              <p>
                Esquiva: {derived.evade.toFixed(1)}%
                {inc?.evade ? (
                  <span className={styles.increase}> +{inc.evade}</span>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div>
              <img src={statusIconPath("shield.svg")} />
              <p>Escudo: {derived.shield}</p>
            </div>
            <div>
              <img src={statusIconPath("hp.svg")} />
              <p>Dano com base no HP: +{derived.maxHpDamageBonus}</p>
            </div>
            <div>
              <img src={statusIconPath("basicDamage.svg")} />
              <p>Dano Verdadeiro: {derived.trueDamage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

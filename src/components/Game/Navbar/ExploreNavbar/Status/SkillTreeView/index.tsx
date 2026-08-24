import { useRef, useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePassiveSkills } from "@/hooks/usePassiveSkills";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";
import { PassiveSkills } from "@/components/Game/Battle/PassiveSkills";
import styles from "./styles.module.css";

export function SkillTreeView() {
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

  return (
    <div className="containerOfNavbar" style={{ overflow: "hidden" }}>
      <h2>Árvore de Habilidades</h2>
      <div ref={containerRef} className={styles.container}>
        <PassiveSkills characterId={player.character} startIndex={0} />
      </div>
    </div>
  );
}

import { useRef, useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { usePassiveSkills } from "@/hooks/usePassiveSkills";
import { getComboMoves } from "@/data/battle/comboMoves";
import { useGameControlsLayer } from "@/hooks/useGameControlsLayer";
import { PassiveSkills } from "@/components/PassiveSkills";
import { ComboList } from "@/components/Navbar/Status/ComboList";
import styles from "./styles.module.css";

export function SkillTreeView() {
  const { player } = usePlayer();
  const { skills } = usePassiveSkills(player.character);
  const combos = getComboMoves(player.character);
  const totalItems = skills.length + combos.length;

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
        <ComboList characterId={player.character} startIndex={skills.length} />
      </div>
    </div>
  );
}

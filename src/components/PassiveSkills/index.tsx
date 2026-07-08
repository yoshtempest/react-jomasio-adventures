import { usePassiveSkills } from "@/hooks/usePassiveSkills";
import { Zap, ArrowUp, Lock, CheckCircle, type LucideIcon } from "lucide-react";
import styles from "./styles.module.css";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  ArrowUp,
};

export function PassiveSkills({ characterId, startIndex = 0 }: { characterId: CharacterId; startIndex?: number }) {
  const { skills, level } = usePassiveSkills(characterId);

  return (
    <div className={styles.marginTop}>
      <p className="StatusTitle">Habilidades Passivas</p>
      {skills.map((skill, i) => {
        const unlocked = level >= skill.levelRequired;
        const Icon = ICON_MAP[skill.icon] ?? Zap;

        return (
          <div
            key={skill.id}
            className={styles.skillRow}
            style={{ opacity: unlocked ? 1 : 0.5 }}
            data-index={startIndex + i}
          >
            {unlocked ? (
              <CheckCircle size={16} color="#4ade80" />
            ) : (
              <Lock size={16} color="#666" />
            )}
            <Icon size={16} color={unlocked ? "#fbbf24" : "#666"} />
            <span className={styles.skillName} style={{ color: unlocked ? "#fff" : "#888" }}>
              {skill.name}
            </span>
            <span className={styles.unlocked}>
              {unlocked ? "Desbloqueado" : `Nv. ${skill.levelRequired}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

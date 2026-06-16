import { usePassiveSkills } from "@/hooks/usePassiveSkills";
import { Zap, ArrowUp, Lock, CheckCircle, type LucideIcon } from "lucide-react";
import styles from "./styles.module.css";

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  ArrowUp,
};

export function PassiveSkills({ characterId }: { characterId: CharacterId }) {
  const { skills, level } = usePassiveSkills(characterId);

  return (
    <div className={styles.marginTop}>
      <p className={styles.title}>Habilidades Passivas</p>
      {skills.map((skill) => {
        const unlocked = level >= skill.levelRequired;
        const Icon = ICON_MAP[skill.icon] ?? Zap;

        return (
          <div
            key={skill.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 8,
              opacity: unlocked ? 1 : 0.5,
            }}
          >
            {unlocked ? (
              <CheckCircle size={16} color="#4ade80" />
            ) : (
              <Lock size={16} color="#666" />
            )}
            <Icon size={16} color={unlocked ? "#fbbf24" : "#666"} />
            <span style={{ fontSize: 13, color: unlocked ? "#fff" : "#888" }}>
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

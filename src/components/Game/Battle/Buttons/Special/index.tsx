import { Zap } from "lucide-react";
import styles from "./styles.module.css";

type Props = {
  ready: boolean;
  remaining: number;
  disabled?: boolean;
  onClick: () => void;
};

/**
 * Botão Special do HUD: o especial saiu de g/Tab (que agora abre a
 * BattleNavbar) e virou botão próprio, com cooldown único de 20s reduzido
 * pela redução de cooldown do personagem. As cargas da barra não têm mais a
 * ver com ele — a barra é só da Expansão de Domínio.
 */
export function SpecialButton({
  ready,
  remaining,
  disabled = false,
  onClick,
}: Props) {
  const locked = !ready || disabled;

  return (
    <button
      className={`abilityButton ${styles.button} ${ready ? styles.ready : ""} ${
        disabled ? "abilityDisabled" : ""
      }`}
      onClick={onClick}
      disabled={locked}
      title="Especial: ataque especial do personagem. Cooldown de 20s."
    >
      <span className={`abilityLabel ${styles.label}`}>
        <Zap size={13} />
        SPECIAL
      </span>
      {!ready && remaining > 0 && (
        <span className={styles.cooldown}>{remaining.toFixed(1)}s</span>
      )}
    </button>
  );
}

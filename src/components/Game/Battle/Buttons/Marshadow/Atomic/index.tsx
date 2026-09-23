import { Atom } from "lucide-react";
import styles from "./styles.module.css";

type Props = {
  ready: boolean;
  remaining: number;
  disabled?: boolean;
  onClick: () => void;
};

/**
 * Botão da habilidade "I Am Atomic" do marcelo: dispara a sequência de
 * sprites da habilidade centrada no inimigo com maior vida máxima e causa
 * dano em todos os inimigos num raio de 300px (2x no alvo, 1x nos demais).
 * Cooldown de 20s (mostrado no rótulo quando recarregando).
 */
export function AtomicButton({
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
      title="I Am Atomic: explosão centrada no inimigo com maior vida máxima, causando dano especial em todos os inimigos num raio de 300px (2x no alvo). Cooldown de 20s."
    >
      <span className={`abilityLabel ${styles.label}`}>
        <Atom size={13} />
        I AM ATOMIC
      </span>
      {!ready && remaining > 0 && (
        <span className={styles.cooldown}>{remaining.toFixed(1)}s</span>
      )}
    </button>
  );
}
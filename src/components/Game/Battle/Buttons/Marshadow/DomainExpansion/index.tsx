import { Sparkles } from "lucide-react";
import styles from "./styles.module.css";

type Props = {
  ready: boolean;
  remaining: number;
  disabled?: boolean;
  onClick: () => void;
};

/**
 * Botão da habilidade "Expansão de Domínio" do marcelo: o jogador se
 * teletransporta para a ponta mais próxima do mapa (com blink visual) e uma
 * instância do mugetsuEffect cobre toda a altura do mapa, varrendo de uma
 * ponta à outra e matando instantaneamente (100% da vida máxima) tudo que
 * toca. Cooldown de 45s (mostrado no rótulo quando recarregando).
 */
export function DomainExpansionButton({
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
      title="Expansão de Domínio: teleporta para a ponta mais próxima do mapa e invoca o mugetsuEffect, que varre o mapa inteiro matando todos os inimigos instantaneamente (100% da vida máxima). Cooldown de 45s."
    >
      <span className={`abilityLabel ${styles.label}`}>
        <Sparkles size={13} />
        EXPANSÃO DE DOMÍNIO
      </span>
      {!ready && remaining > 0 && (
        <span className={styles.cooldown}>{remaining.toFixed(1)}s</span>
      )}
    </button>
  );
}
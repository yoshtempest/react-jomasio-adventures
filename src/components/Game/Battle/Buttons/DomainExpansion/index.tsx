import { Sparkles } from "lucide-react";
import styles from "./styles.module.css";

type Props = {
  /** Nome do domínio do personagem (rótulo e tooltip). */
  name: string;
  description: string;
  /** Cor do efeito (borda, rótulo e brilho), vinda de `DOMAIN_EXPANSIONS`. */
  accent: string;
  /** Fundo da arte da habilidade — só o marcelo tem; os demais usam o accent. */
  background?: string;
  ready: boolean;
  disabled?: boolean;
  onClick: () => void;
};

/**
 * Botão da Expansão de Domínio: presente para TODOS os personagens, porque a
 * barra de cargas é universal. O marcelo roda o mugetsu bespoke (com a arte
 * `habilities/domainExpansion/background.svg`); os demais rodam o burst
 * universal (`kind: "burst"`), todos com nome/cor de `DOMAIN_EXPANSIONS`.
 */
export function DomainExpansionButton({
  name,
  description,
  accent,
  background,
  ready,
  disabled = false,
  onClick,
}: Props) {
  const locked = !ready || disabled;

  return (
    <button
      className={`abilityButton ${styles.button} ${ready ? styles.ready : ""} ${
        disabled ? "abilityDisabled" : ""
      }`}
      style={
        {
          "--domain-accent": accent,
          backgroundImage: background ? `url(${background})` : undefined,
        } as React.CSSProperties & Record<string, string>
      }
      onClick={onClick}
      disabled={locked}
      title={`${name}: ${description}`}
    >
      <span className={`abilityLabel ${styles.label}`}>
        <Sparkles size={13} />
        {name.toUpperCase()}
      </span>
    </button>
  );
}

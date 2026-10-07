import styles from "./styles.module.css";

type Props = {
  active: boolean;
  /** Nome do domínio do personagem (ex.: "Campo Fulminante"). */
  name: string;
  /** Cor do efeito, vinda de `DOMAIN_EXPANSIONS`. */
  accent: string;
};

/**
 * Flash visual do burst da Expansão de Domínio universal: tinge a arena com o
 * accent do personagem e estampa o nome do domínio no centro enquanto o dano
 * varre a arena (~900ms). Só o marcelo não usa — ele tem o mugetsu e o
 * `DomainExpansionBackground`.
 */
export function DomainBurstOverlay({ active, name, accent }: Props) {
  if (!active) return null;

  return (
    <div
      className={styles.overlay}
      style={
        { "--domain-accent": accent } as React.CSSProperties &
          Record<string, string>
      }
    >
      <span className={styles.name}>{name}</span>
    </div>
  );
}

import { playerPathMarshadowHabilities } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  /** True durante toda a Expansão de Domínio (do clique ao fim da varredura). */
  active: boolean;
};

/**
 * Fundo da Expansão de Domínio: cobre o fundo da batalha (o original fica só
 * por baixo, durante a transição) com o `expansion.svg` do marcelo, surgindo
 * sendo "renderizado" de baixo para cima via clip-path. É o primeiro filho do
 * `.Master` com z-index 0, então pinta logo acima do fundo e abaixo de todo o
 * resto (HUD, jogador/NPCs, intros) em ordem de DOM.
 */
export function DomainExpansionBackground({ active }: Props) {
  if (!active) return null;

  return (
    <div
      role="presentation"
      className={styles.overlay}
      style={{
        backgroundImage: `url(${playerPathMarshadowHabilities(
          "/domainExpansion/expansion.svg",
        )})`,
      }}
    />
  );
}
import { Zap } from "lucide-react";
import { playerProjectilePath } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  disabled?: boolean;
  onClick: () => void;
  /** Stacks de Laser disponíveis na Forma Vastolord (exibidos quando > 1). */
  charges?: number;
};

/**
 * Botão do Laser da Forma Vastolord do marcelo: dispara um feixe que cruza o
 * mapa por 3s, causando 1% do dano base a cada 20ms e empurrando o inimigo.
 * Só é renderizado durante a forma; cada inimigo derrotado (incluindo minions)
 * concede +1 stack de Laser.
 */
export function VastolordLaserButton({
  disabled = false,
  onClick,
  charges = 0,
}: Props) {
  const imageUrl = playerProjectilePath("vastolordLaser.svg");

  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      style={{
        backgroundImage: `url("${imageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={onClick}
      disabled={disabled}
      title="Laser Vastolord: feixe que cruza o mapa por 3s causando 1% do dano base a cada 20ms de contato e empurrando o inimigo. Cada inimigo derrotado na forma concede +1 stack de laser."
    >
      {charges > 1 && (
        <span className={styles.charges}>{charges}x</span>
      )}
      <span className={styles.label}>
        <Zap size={13} />
        VASTOLORD LASER
      </span>
    </button>
  );
}
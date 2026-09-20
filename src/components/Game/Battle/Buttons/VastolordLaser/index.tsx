import { Zap } from "lucide-react";
import { playerProjectilePath } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  disabled?: boolean;
  onClick: () => void;
};

/**
 * Botão do Laser da Forma Vastolord do marcelo: dispara um feixe que cruza o
 * mapa por 3s, causando 1% do dano base a cada 20ms e empurrando o inimigo.
 * Só é renderizado durante a forma; pode ser usado apenas uma vez por forma.
 */
export function VastolordLaserButton({ disabled = false, onClick }: Props) {
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
      title="Laser Vastolord: feixe que cruza o mapa por 3s causando 1% do dano base a cada 20ms de contato e empurrando o inimigo. Uso único por forma."
    >
      <span className={styles.label}>
        <Zap size={13} />
        VASTOLORD LASER
      </span>
    </button>
  );
}
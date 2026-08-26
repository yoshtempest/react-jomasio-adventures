import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useSettings } from "@/hooks/useSetting";
import { resolveBattleSprite } from "@/utils/paths";
import styles from "./styles.module.css";

type ComboConfig = {
  sprite: string;
  label: string;
};

const COMBO_STATES: Partial<Record<PlayerState, ComboConfig>> = {
  blocked: { sprite: "blockAttack", label: "Atacar" },
  falling: { sprite: "fallingAttack", label: "Atacar" },
};

export function ComboAction() {
  const { player } = usePlayer();
  const { activeControls } = useGameControls();
  const { showComboAction } = useSettings();

  const combo = COMBO_STATES[player.state];
  if (!combo || !showComboAction) return null;

  const src = resolveBattleSprite(player.character, combo.sprite);

  function handleDown() {
    activeControls?.onConfirm?.();
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onPointerDown={handleDown}>
        <img src={src} alt={combo.label} draggable={false} />
        <h3>L</h3>
      </button>
    </div>
  );
}

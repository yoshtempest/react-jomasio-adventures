import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useSettings } from "@/contexts/SettingsContext";
import { asset } from "@/utils/paths";
import styles from "./styles.module.css";

type ComboConfig = {
  sprite: string;
  label: string;
};

const COMBO_STATES: Partial<Record<PlayerState, ComboConfig>> = {
  blocked: { sprite: "blockAttack.svg", label: "Atacar" },
  falling: { sprite: "fallingAttack.svg", label: "Atacar" },
};

export function ComboAction() {
  const { player } = usePlayer();
  const { activeControls } = useGameControls();
  const { showComboAction } = useSettings();

  const combo = COMBO_STATES[player.state];
  if (!combo || !showComboAction) return null;

  const src = asset(
    `assets/player/${player.character}/inFight/${combo.sprite}`,
  );

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

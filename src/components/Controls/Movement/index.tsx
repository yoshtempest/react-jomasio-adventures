import { useKeyboardMovement } from "@/hooks/player/useKeyboardMovement";
import { JoystickMovement } from "./Joystick";
import { ButtonsMovement } from "./Buttons";

import styles from "./styles.module.css";

export function Movement() {
  const { pressed, mode, setMode, activeControls } = useKeyboardMovement();

  return (
    <>
      <button
        className={styles.toggle}
        onClick={() =>
          setMode((prev) => (prev === "joystick" ? "buttons" : "joystick"))
        }
      >
        {mode === "joystick" ? "◉" : "✚"}
      </button>

      {mode === "joystick" ? (
        <JoystickMovement activeControls={activeControls} />
      ) : (
        <ButtonsMovement activeControls={activeControls} pressed={pressed} />
      )}
    </>
  );
}

import {
  BLINK_SILHOUETTE_FADE_MS,
  BLINK_UNTIL_TELEPORT_MS,
} from "@/gameRules/battle/cursedEnergy";

import styles from "../styles.module.css";

interface BlinkConfig {
  className?: string;
  duration?: string;
}

export function getBlinkConfig(
  blinkSilhouette: "black" | "white" | null,
): BlinkConfig {
  if (blinkSilhouette === "black") {
    return {
      className: styles.blinkBlack,
      duration: `${BLINK_UNTIL_TELEPORT_MS}ms`,
    };
  }

  if (blinkSilhouette === "white") {
    return {
      className: styles.blinkWhite,
      duration: `${BLINK_SILHOUETTE_FADE_MS}ms`,
    };
  }

  return {
    className: "",
    duration: undefined,
  };
}
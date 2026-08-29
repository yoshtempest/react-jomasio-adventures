import { useState } from "react";
import { playerPath } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  active: boolean;
  character: string | null;
};

export function SpecialIntro({ active, character }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!active || !character) return null;

  return (
    <div className={styles.overlay}>
      {!imageFailed && (
        <img
          className={styles.image}
          src={playerPath(`/${character}/specialBackground.svg`)}
          alt=""
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  );
}
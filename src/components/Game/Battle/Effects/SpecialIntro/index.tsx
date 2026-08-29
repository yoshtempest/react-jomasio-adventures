import { useState } from "react";
import { playerPath } from "@/utils/paths";
import { getCharacterElementGradient } from "@/data/types/elementGradients";
import styles from "./styles.module.css";

type Props = {
  active: boolean;
  character: string | null;
};

export function SpecialIntro({ active, character }: Props) {
  const [faceFrontFailed, setFaceFrontFailed] = useState(false);

  if (!active || !character) return null;

  const gradient = getCharacterElementGradient(character);
  const faceSrc = faceFrontFailed
    ? playerPath(`/${character}/face.svg`)
    : playerPath(`/${character}/faceFront.svg`);

  return (
    <div className={styles.modal}>
      <div
        className={styles.band}
        style={{ background: `linear-gradient(45deg, ${gradient.join(", ")})` }}
      />
      <img
        className={styles.face}
        src={faceSrc}
        alt=""
        onError={() => setFaceFrontFailed(true)}
      />
    </div>
  );
}
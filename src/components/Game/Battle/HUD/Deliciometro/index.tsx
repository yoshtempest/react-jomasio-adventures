import { asset } from "@/utils/asset";
import { useEffect, useRef } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import styles from "./styles.module.css";

type Props = {
  delicia: number; // 0 - 6
  hitsToSpecial?: number;
};

export function Deliciometro({ delicia, hitsToSpecial = 6 }: Props) {
  const angle = (delicia / hitsToSpecial) * 180 - 90;

  const hasPlayedRef = useRef(false);
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  useEffect(() => {
    if (delicia >= hitsToSpecial && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      playSoundRef.current("deliciometroIsFull");
    }

    // 🔄 reset quando diminuir
    if (delicia < hitsToSpecial) {
      hasPlayedRef.current = false;
    }
  }, [delicia, hitsToSpecial]);

  return (
    <div
    className={styles.container}>
      <img
        src={asset("/assets/deliciometro.svg")}
        className={styles.image}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          width: 2,
          height: 20,
          background: "red",
          transformOrigin: "bottom center",
          transform: `translateX(-50%) translateY(50%) rotate(${angle}deg)`,
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );
}

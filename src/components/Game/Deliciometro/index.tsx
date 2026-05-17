import { asset } from "@/utils/asset";
import { useEffect, useRef } from "react";


type Props = {
  delicia: number; // 0 - 6
  hitsToSpecial?: number;
};

export function Deliciometro({ delicia, hitsToSpecial = 6 }: Props) {
  const angle = (delicia / hitsToSpecial) * 180 - 90;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // cria áudio uma única vez
    if (!audioRef.current) {
      audioRef.current = new Audio(
        asset("/assets/songs/soundEffects/player/deliciometroIsFull.mp3")
      );
    }

    // 🎯 quando atingir o máximo
    if (delicia >= hitsToSpecial && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    // 🔄 reset quando diminuir
    if (delicia < hitsToSpecial) {
      hasPlayedRef.current = false;
    }
  }, [delicia, hitsToSpecial]);

  return (
    <div
      style={{
        position: "relative",
        width: 50,
        height: 20,
        border: "2px solid black",
        background: "#333",
      }}
    >
        <img src={asset("/assets/deliciometro.svg")}
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
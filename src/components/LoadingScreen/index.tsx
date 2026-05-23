import { useEffect, useRef } from "react";
import { asset } from "@/utils/asset";

export function LoadingScreen() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(
      asset("/assets/songs/transitions/blink.mp3")
    );

    audio.volume = 0.6;
    audio.currentTime = 0;

    audio.play().catch(() => {
      // evita erro de autoplay bloqueado
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="loading-screen">
      <img
        className="loading-logo"
        src={asset("/assets/logo.svg")}
      />
    </div>
  );
}
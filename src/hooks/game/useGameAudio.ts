import { useEffect, useRef } from "react";
import { useAudio } from "@/hooks/audio/useAudio";
import { useLatestRef } from "@/hooks/useLatestRef";
import { resolveAsset } from "@/utils/paths";

type Props = {
  src: string;
  loop?: boolean;
  volume?: number;
};

export function useGameAudio({ src, loop = true, volume = 0.5 }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { bgmVolume } = useAudio();
  const loopRef = useLatestRef(loop);
  const volumeRef = useLatestRef(volume);
  const bgmVolumeRef = useLatestRef(bgmVolume);

  // Listener de re-tentativa do autoplay: quando o browser bloqueia o play por
  // falta de interação (NotAllowedError), tenta de novo no primeiro gesto do
  // usuário em vez de spammar o console de erro.
  const gestureRetryRef = useRef<(() => void) | null>(null);

  const isPlaying = () => {
    return !!audioRef.current && !audioRef.current.paused;
  };

  useEffect(() => {
    const audio = new Audio(resolveAsset(src));

    audio.loop = loopRef.current;
    audio.preload = "auto";

    audio.volume = volumeRef.current * (bgmVolumeRef.current / 100);

    audio.load();

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src, bgmVolumeRef, loopRef, volumeRef]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume * (bgmVolume / 100);
  }, [volume, bgmVolume]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.loop = loop;
  }, [loop]);

  // Limpa o listener de gesto pendente no unmount (regra: sempre limpar).
  useEffect(() => {
    return () => {
      const retry = gestureRetryRef.current;
      if (retry) {
        window.removeEventListener("pointerdown", retry, true);
        window.removeEventListener("keydown", retry, true);
        gestureRetryRef.current = null;
      }
    };
  }, []);

  // Autoplay bloqueado: agenda uma re-tentativa única no próximo gesto.
  function retryPlayOnGesture() {
    if (gestureRetryRef.current) return;
    const retry = () => {
      gestureRetryRef.current = null;
      window.removeEventListener("pointerdown", retry, true);
      window.removeEventListener("keydown", retry, true);
      void play();
    };
    gestureRetryRef.current = retry;
    window.addEventListener("pointerdown", retry, true);
    window.addEventListener("keydown", retry, true);
  }

  const play = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
    } catch (err) {
      if (!(err instanceof DOMException)) {
        console.error(err);
        return;
      }
      // Interrupção de um play anterior — comportamento normal, ignore.
      if (err.name === "AbortError") return;
      // Sem gesto do usuário ainda (política de autoplay) — normal no primeiro
      // carregamento; re-tenta no primeiro toque/tecla em vez de logar.
      if (err.name === "NotAllowedError") {
        retryPlayOnGesture();
        return;
      }
      console.error(err);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const stop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const setVolume = (value: number) => {
    if (!audioRef.current) return;

    audioRef.current.volume = value;
  };

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
  };
}

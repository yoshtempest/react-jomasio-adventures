import { useEffect } from "react";
import { useAudio } from "@/hooks/useAudio";
import { soundEffectPath } from "@/utils/paths";

const OUTRO_SOUND_VOLUME = 1;

/**
 * Toca o efeito sonoro de fim de batalha durante o outro.
 *
 * O arquivo é procurado em
 * `assets/songs/soundEffects/player/<character>/<battleResult>.mp3`
 * (victory.mp3 | defeat.mp3). Caso não exista som na pasta do personagem,
 * toca o fallback `player/artur/defeat.mp3`.
 */
export function useBattleOutroSound(
  character: string,
  type: "victory" | "defeat",
) {
  const { sfxVolume } = useAudio();

  useEffect(() => {
    const battleResult = type === "victory" ? "victory.mp3" : "defeat.mp3";
    const primarySrc = soundEffectPath(`/player/${character}/${battleResult}`);
    const fallbackSrc = soundEffectPath("/player/artur/defeat.mp3");

    const audio = new Audio();
    audio.preload = "auto";
    audio.volume = (sfxVolume / 100) * OUTRO_SOUND_VOLUME;

    let fallbackTriggered = false;

    const playFallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      audio.removeEventListener("error", handleError);
      audio.src = fallbackSrc;
      audio.play().catch(() => {});
    };

    const handleError = () => playFallback();
    audio.addEventListener("error", handleError);

    audio.src = primarySrc;
    audio.play().catch(playFallback);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.pause();
      audio.src = "";
    };
  }, [character, type, sfxVolume]);
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useAudio } from "@/contexts/AudioContext";
import { createSounds } from "@/utils/soundEffects";

export type SoundId =
  | "win"
  | "defeat"
  | "run"
  | "tryAgain"
  | "receivedItem"
  | "usedItem"
  | "deliciometroIsFull"
  | "questUpdated"
  | "levelUp"
  | "loading"
  | "moveMenu"
  | "selectMenu"
  | "chargeAttack"
  | "chargingAttack"
  | "closeMenu"
  | "swordDeflected"
  | "jhowsimarVemCa"
  | "getTheLapada"
  | "marshadowSpecial"
  | "drikaSpecial"
  | "slimitaJump"
  | "equip"
  | "unequip"
  | "unlockedTitle"
  | "eating"
  | "drinkingPotion"
  | "jhowsimarJooj"
  | "gainXp"
  | "boom"
  | "bite"
  | "vandinhaPunch"
  | "breakDish"
  | "summon"
  | "hulk"
  | "goatJump"
  | "smash"
  | "knifeAttack"
  | "knifeCut"
  | "hungryDeath";

type SoundEffectsContextType = {
  playSound: (sound: SoundId, loop?: boolean, volumeOverride?: number) => void;
  stopSound: (sound: SoundId) => void;
};

const SoundEffectsContext = createContext<SoundEffectsContextType | null>(null);

const SOUND_VOLUMES: Partial<Record<SoundId, number>> = {
  boom: 3,
  slimitaJump: 0.3,
  marshadowSpecial: 0.7,
  win: 0.5,
};

export function SoundEffectsProvider({ children }: { children: ReactNode }) {
  const { sfxVolume } = useAudio();
  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  const soundsRef = useRef<Record<SoundId, HTMLAudioElement>>(
    {} as Record<SoundId, HTMLAudioElement>,
  );

  useEffect(() => {
    soundsRef.current = createSounds();

    Object.values(soundsRef.current).forEach((audio) => {
      audio.preload = "none";
    });

    return () => {
      Object.values(soundsRef.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  useEffect(() => {
    Object.values(soundsRef.current).forEach((audio) => {
      audio.volume = sfxVolume / 100;
    });
  }, [sfxVolume]);

  const playSound = useCallback(async (sound: SoundId, loop?: boolean, volumeOverride?: number) => {
    const audio = soundsRef.current[sound];

    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = loop ?? false;
      audio.volume = (sfxVolumeRef.current / 100) * (SOUND_VOLUMES[sound] ?? 1) * (volumeOverride ?? 1);

      await audio.play();
    } catch {
      // AbortError é esperado quando play() é interrompido por pause()
    }
  }, []);

  const stopSound = useCallback((sound: SoundId) => {
    const audio = soundsRef.current[sound];

    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }, []);

  const value = useMemo(
    () => ({ playSound, stopSound }),
    [playSound, stopSound],
  );

  return (
    <SoundEffectsContext.Provider value={value}>
      {children}
    </SoundEffectsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSoundEffects() {
  const context = useContext(SoundEffectsContext);

  if (!context) {
    throw new Error(
      "useSoundEffects deve ser usado dentro de SoundEffectsProvider",
    );
  }

  return context;
}

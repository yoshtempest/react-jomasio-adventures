import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAudio } from "@/contexts/AudioContext";
import { asset } from "@/utils/asset";

type SoundId =
  | "win"
  | "defeat"
  | "run"
  | "tryAgain"
  | "receivedItem"
  | "usedItem"
  | "deliciometroIsFull"
  | "questUpdated"
  | "levelUp"
  | "moveMenu"
  | "selectMenu"
  | "closeMenu";

type SoundEffectsContextType = {
  playSound: (sound: SoundId) => void;
};

const SoundEffectsContext =
  createContext<SoundEffectsContextType | null>(null);

export function SoundEffectsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { volume: masterVolume } = useAudio();

  const soundsRef = useRef<Record<SoundId, HTMLAudioElement>>(
    {} as Record<SoundId, HTMLAudioElement>
  );

  useEffect(() => {
    soundsRef.current = {
        win: new Audio(
            asset("/assets/songs/soundEffects/player/win.mp3")
        ),
        defeat: new Audio(
            asset("/assets/songs/soundEffects/player/defeat.mp3")
        ),
        run: new Audio(
            asset("/assets/songs/soundEffects/player/run.mp3")
        ),
        tryAgain: new Audio(
            asset("/assets/songs/soundEffects/player/tryAgain.mp3")
        ),
        receivedItem: new Audio(
            asset("/assets/songs/soundEffects/player/receivedAnItem.mp3")
        ),
        usedItem: new Audio(
            asset("/assets/songs/soundEffects/player/usedAnItem.mp3")
        ),
        deliciometroIsFull: new Audio(
            asset("/assets/songs/soundEffects/player/deliciometroIsFull.mp3")
        ),
        questUpdated: new Audio(
            asset("/assets/songs/soundEffects/player/questUpdated.mp3")
        ),
        levelUp: new Audio(
            asset("/assets/songs/soundEffects/player/levelUp.mp3")
        ),
        moveMenu: new Audio(
            asset("/assets/songs/soundEffects/menu/move.mp3")
        ),
        selectMenu: new Audio(
            asset("/assets/songs/soundEffects/menu/select.mp3")
        ),
        closeMenu: new Audio(
            asset("/assets/songs/soundEffects/menu/close.mp3")
        ),
    };

    Object.values(soundsRef.current).forEach((audio) => {
      audio.preload = "auto";
      audio.load();
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
      audio.volume = masterVolume / 100;
    });
  }, [masterVolume]);

  const playSound = async (sound: SoundId) => {
    const audio = soundsRef.current[sound];

    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;

      await audio.play();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SoundEffectsContext.Provider
      value={{
        playSound,
      }}
    >
      {children}
    </SoundEffectsContext.Provider>
  );
}

export function useSoundEffects() {
  const context = useContext(SoundEffectsContext);

  if (!context) {
    throw new Error(
      "useSoundEffects deve ser usado dentro de SoundEffectsProvider"
    );
  }

  return context;
}
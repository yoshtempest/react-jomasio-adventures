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
import { asset } from "@/utils/asset";

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
  | "hungryDeath";

type SoundEffectsContextType = {
  playSound: (sound: SoundId, loop?: boolean) => void;
  stopSound: (sound: SoundId) => void;
};

const SoundEffectsContext = createContext<SoundEffectsContextType | null>(null);

const SOUND_VOLUMES: Partial<Record<SoundId, number>> = {
  boom: 3,
  slimitaJump: 0.3,
};

export function SoundEffectsProvider({ children }: { children: ReactNode }) {
  const { sfxVolume } = useAudio();
  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  const soundsRef = useRef<Record<SoundId, HTMLAudioElement>>(
    {} as Record<SoundId, HTMLAudioElement>,
  );

  useEffect(() => {
    soundsRef.current = {
      win: new Audio(asset("/assets/songs/soundEffects/player/win.mp3")),
      defeat: new Audio(asset("/assets/songs/soundEffects/player/defeat.mp3")),
      run: new Audio(asset("/assets/songs/soundEffects/player/run.mp3")),
      tryAgain: new Audio(asset("/assets/songs/soundEffects/player/tryAgain.mp3")),
      receivedItem: new Audio(asset("/assets/songs/soundEffects/player/receivedAnItem.mp3")),
      usedItem: new Audio(asset("/assets/songs/soundEffects/player/usedAnItem.mp3")),
      deliciometroIsFull: new Audio(asset("/assets/songs/soundEffects/player/deliciometroIsFull.mp3")),
      questUpdated: new Audio(asset("/assets/songs/soundEffects/player/questUpdated.mp3")),
      levelUp: new Audio(asset("/assets/songs/soundEffects/player/levelUp.mp3")),
      loading: new Audio(asset("/assets/songs/transitions/blink.mp3")),
      moveMenu: new Audio(asset("/assets/songs/soundEffects/menu/move.mp3")),
      selectMenu: new Audio(asset("/assets/songs/soundEffects/menu/select.mp3")),
      closeMenu: new Audio(asset("/assets/songs/soundEffects/menu/close.mp3")),
      chargingAttack: new Audio(asset("/assets/songs/soundEffects/player/chargingAttack.mp3")),
      chargeAttack: new Audio(asset("/assets/songs/soundEffects/player/chargeAttack.mp3")),
      swordDeflected: new Audio(asset("/assets/songs/soundEffects/player/marcelo/sword-deflected.mp3")),
      jhowsimarVemCa: new Audio(asset("/assets/songs/soundEffects/npc/jhowsimar/goHere.mp3")),
      marshadowSpecial: new Audio(asset("/assets/songs/soundEffects/player/marcelo/special.mp3")),
      drikaSpecial: new Audio(asset("/assets/songs/soundEffects/player/eduarda/special.mp3")),
      slimitaJump: new Audio(asset("/assets/songs/soundEffects/npc/slimita/jump.mp3")),
      equip: new Audio(asset("/assets/songs/transitions/equip.mp3")),
      unequip: new Audio(asset("/assets/songs/transitions/unequip.mp3")),
      unlockedTitle: new Audio(asset("/assets/songs/soundEffects/player/unlockedTitle.mp3")),
      eating: new Audio(asset("/assets/songs/soundEffects/player/eating.mp3")),
      drinkingPotion: new Audio(asset("/assets/songs/soundEffects/player/drinkingPotion.mp3")),
      jhowsimarJooj: new Audio(asset("/assets/songs/soundEffects/npc/jhowsimar/throw.mp3")),
      boom: new Audio(asset("/assets/songs/soundEffects/npc/slimita/boom.mp3")),
      gainXp: new Audio(asset("/assets/songs/soundEffects/player/gainXp.mp3")),
      hungryDeath: new Audio(asset("/assets/songs/soundEffects/npc/hungryDeath/giveMeAPlate.mp3")),
      bite: new Audio(asset("/assets/songs/soundEffects/npc/hungryDeath/bite.mp3")),
      vandinhaPunch: new Audio(asset("/assets/songs/soundEffects/npc/vandinhaFragment/punch.mp3")),
      breakDish: new Audio(asset("/assets/songs/soundEffects/npc/vandinhaFragment/breakDish.mp3")),
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
      audio.volume = sfxVolume / 100;
    });
  }, [sfxVolume]);

  const playSound = useCallback(async (sound: SoundId, loop?: boolean) => {
    const audio = soundsRef.current[sound];

    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.loop = loop ?? false;
      audio.volume = (sfxVolumeRef.current / 100) * (SOUND_VOLUMES[sound] ?? 1);

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

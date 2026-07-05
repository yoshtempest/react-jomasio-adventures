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

function sfx(path: string): HTMLAudioElement {
  return new Audio(asset(`/assets/songs/soundEffects/${path}`));
}

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
  | "summon"
  | "hulk"
  | "smash"
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
      win: sfx("player/win.mp3"),
      defeat: sfx("player/defeat.mp3"),
      run: sfx("player/run.mp3"),
      tryAgain: sfx("player/tryAgain.mp3"),
      receivedItem: sfx("player/receivedAnItem.mp3"),
      usedItem: sfx("player/usedAnItem.mp3"),
      deliciometroIsFull: sfx("player/deliciometroIsFull.mp3"),
      questUpdated: sfx("player/questUpdated.mp3"),
      levelUp: sfx("player/levelUp.mp3"),
      loading: new Audio(asset("/assets/songs/transitions/blink.mp3")),
      moveMenu: sfx("menu/move.mp3"),
      selectMenu: sfx("menu/select.mp3"),
      closeMenu: sfx("menu/close.mp3"),
      chargingAttack: sfx("player/chargingAttack.mp3"),
      chargeAttack: sfx("player/chargeAttack.mp3"),
      swordDeflected: sfx("player/marcelo/sword-deflected.mp3"),
      jhowsimarVemCa: sfx("npc/jhowsimar/goHere.mp3"),
      marshadowSpecial: sfx("player/marcelo/special.mp3"),
      drikaSpecial: sfx("player/eduarda/special.mp3"),
      slimitaJump: sfx("npc/slimita/jump.mp3"),
      equip: new Audio(asset("/assets/songs/transitions/equip.mp3")),
      unequip: new Audio(asset("/assets/songs/transitions/unequip.mp3")),
      unlockedTitle: sfx("player/unlockedTitle.mp3"),
      eating: sfx("player/eating.mp3"),
      drinkingPotion: sfx("player/drinkingPotion.mp3"),
      jhowsimarJooj: sfx("npc/jhowsimar/throw.mp3"),
      boom: sfx("npc/slimita/boom.mp3"),
      gainXp: sfx("player/gainXp.mp3"),
      hungryDeath: sfx("npc/hungryDeath/giveMeAPlate.mp3"),
      bite: sfx("npc/hungryDeath/bite.mp3"),
      vandinhaPunch: sfx("npc/vandinhaFragment/punch.mp3"),
      breakDish: sfx("npc/vandinhaFragment/breakDish.mp3"),
      hulk: sfx("npc/hungryKing/hulk.mp3"),
      smash: sfx("npc/hungryKing/smash.mp3"),
      summon: sfx("npc/hungryKing/summon.mp3"),
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

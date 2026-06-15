import { asset } from "@/utils/asset";
import type { Player } from "@/utils/types/player/player";

type AttackSoundConfig = {
  volume: number;
  sounds: string[];
};

export const ATTACK_SOUNDS: Partial<
  Record<Player["character"], AttackSoundConfig>
> = {
  eduarda: {
    volume: 0.2,
    sounds: [
      asset("/assets/songs/soundEffects/player/eduarda/normalAttack.mp3"),
    ],
  },

  marcelo: {
    volume: 0.2,
    sounds: [
      asset("/assets/songs/soundEffects/player/marcelo/sword-slash-1.mp3"),
      asset("/assets/songs/soundEffects/player/marcelo/sword-slash-2.mp3"),
      asset("/assets/songs/soundEffects/player/marcelo/sword-slash-4.mp3"),
    ],
  },
};

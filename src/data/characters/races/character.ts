import type { CharacterRace } from "@/utils/types/character/race";

/** Definição de raça de cada personagem jogável. */
export const CHARACTER_RACES: Record<CharacterId, CharacterRace> = {
  marcelo: { races: ["Human", "Obscurian"] },
  eduarda: { races: ["Human", "Luminar"] },
  lucas: { races: ["Human"] },
  samuel: { races: ["Human", "Terran"] },
  artur: { races: ["Human", "Obscurian", "Phantom"] },
  mayra: { races: ["Human", "Maritime", "Phantom"] },
  lucaua: { races: ["Human", "Ferrian", "Psychic"] },
  riquelme: { races: ["Human", "Luminar", "Obscurian"] },
  larissa: { races: ["Human", "Ferrian", "Raykou"] },
  camilly: { races: ["Human"] },
  emanuel: { races: ["Human", "Aerial", "Raykou"] },
  levi: { races: ["Human", "Draconian"] },
};

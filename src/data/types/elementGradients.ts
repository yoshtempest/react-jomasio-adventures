import type { ElementType } from "@/utils/types/battle/element";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";

/**
 * Cores base por elemento, usadas no gradiente do overlay do special.
 * Elementos combinados do personagem definem a paleta do gradiente
 * (ex.: Pyrus + Haos = tons de vermelho fogo com branco/amarelo dourado).
 */
export const ELEMENT_GRADIENTS: Record<ElementType, readonly string[]> = {
  Pyrus: ["#ff3c00", "#ff8c00", "#ffd700"],
  Aquos: ["#00bfff", "#1e90ff", "#e0faff"],
  Subterra: ["#6d4c41", "#a1887f", "#3e2723"],
  Ventus: ["#e0f7fa", "#4dd0e1", "#ffffff"],
  Darkus: ["#1a0033", "#4b0082", "#2d1554"],
  Electricus: ["#fdd835", "#fff59d", "#8eec45"],
  Haos: ["#ffd700", "#fff3b0", "#fffdf0"],
  Metallum: ["#b0bec5", "#cfd8dc", "#607d8b"],
  Natura: ["#66bb6a", "#a5d6a7", "#2e7d32"],
  Psychicus: ["#ff5ca8", "#7c4dff", "#ffd6ec"],
  Nympha: ["#80deea", "#b388ff", "#e1bee7"],
  Draco: ["#c62828", "#ffb74d", "#66bb6a"],
  Umbra: ["#2a0040", "#6a1b9a", "#15001f"],
  Normalis: ["#eceff1", "#ffffff", "#b0bec5"],
  Cryo: ["#e0f7fa", "#b3e5fc", "#81d4fa"],
};

const DEFAULT_GRADIENT = ["#eceff1", "#ffffff", "#b0bec5"];

/** Cores do gradiente do special para um personagem, pela combinação dos seus elementos. */
export function getCharacterElementGradient(character: string): string[] {
  const types = CHARACTER_ELEMENT_TYPES[character as CharacterId] ?? [];
  const colors: string[] = [];

  for (const type of types) {
    for (const color of ELEMENT_GRADIENTS[type] ?? []) {
      if (!colors.includes(color)) colors.push(color);
    }
  }

  return colors.length > 0 ? colors : DEFAULT_GRADIENT;
}
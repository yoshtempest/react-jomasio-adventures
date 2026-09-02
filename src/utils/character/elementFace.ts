import type { CSSProperties } from "react";
import { getCharacterElementGradient } from "@/data/types/elementGradients";

const GRADIENT_ANGLE = "150deg";

/**
 * Estilo do quadro onde a face do personagem fica, derivado da tipagem dele.
 *
 * Uma tipagem rende o gradiente da própria cor (Aquos = tons de azul); duas
 * ou mais rendem a mistura, na ordem em que a tipagem foi declarada em
 * CHARACTER_ELEMENT_TYPES (Aquos + Pyrus = azul virando vermelho).
 * Personagem sem tipagem declarada cai no gradiente neutro.
 */
export function characterFaceStyle(character: string): CSSProperties {
  const colors = getCharacterElementGradient(character);
  return {
    background: `linear-gradient(${GRADIENT_ANGLE}, ${colors.join(", ")})`,
  };
}

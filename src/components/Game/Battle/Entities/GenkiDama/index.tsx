import { spriteMap } from "@/data/battle/projectileSprites";
import { GENKI_DAMA_BASE_SIZE } from "@/data/characters/emanuel";
import type { GenkiDamaVisual } from "@/utils/types/character/emanuel";

type Props = {
  visual: GenkiDamaVisual;
  battleScaleX: number;
  battleScaleY: number;
};

/**
 * Esfera da Genki Dama do Emanuel: rende o projétil `genkiDama.svg` no formato
 * atual (pairando sobre o jogador enquanto prepara, ou voando até o inimigo).
 * O tamanho base cresce pelo multiplicador de escala (1.2x por segundo).
 */
export function GenkiDama({ visual, battleScaleX, battleScaleY }: Props) {
  const size = GENKI_DAMA_BASE_SIZE * visual.scale;

  return (
    <img
      src={spriteMap.genkiDama}
      style={{
        position: "absolute",
        left: visual.x * battleScaleX,
        top: visual.y * battleScaleY,
        width: size,
        transform: "translate(-50%, -200%)",
        zIndex: 18,
        pointerEvents: "none",
      }}
    />
  );
}
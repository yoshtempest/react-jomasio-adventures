/**
 * Aplica o frame atual da animação idle sobre o sprite base resolvido.
 *
 * Troca o sufixo `idle.svg` pelo nome do frame (ex.: `idle2.svg`) e devolve o
 * caminho inalterado quando não há o que trocar: frame 0, sequência de um só
 * frame, ou caminho que não termina em `idle.svg` (crouch usa
 * `idleCrounched.svg` e a sequência de habilidades usa `starting.svg`).
 */
export function idleFrameSprite(
  baseSrc: string,
  frames: readonly string[],
  frameIndex: number,
): string {
  const frameName = frames[frameIndex];

  if (frameIndex === 0 || frameName == null || frameName === "idle") {
    return baseSrc;
  }

  const IDLE_SUFFIX = "idle.svg";
  if (!baseSrc.endsWith(IDLE_SUFFIX)) {
    return baseSrc;
  }

  return `${baseSrc.slice(0, -IDLE_SUFFIX.length)}${frameName}.svg`;
}

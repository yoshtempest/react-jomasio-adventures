/**
 * Viewport em orientação forçada landscape.
 *
 * O jogo foi projetado para landscape. Em aparelhos portrait o conteúdo é
 * rotacionado (ver `styles/viewport.css`); estes helpers devolvem as
 * dimensões virtuais já trocadas, para que o layout lendo `window.innerWidth`
 * / `innerHeight` raciocine sempre em coordenadas landscape.
 */
export function isPortraitViewport(): boolean {
  return window.innerHeight > window.innerWidth;
}

/** Dimensões virtuais sempre landscape (troca os eixos em portrait). */
export function getViewportSize(): { width: number; height: number } {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (height > width) return { width: height, height: width };
  return { width, height };
}
/**
 * Medidas do grid de cena e da área de jogo.
 *
 * Fonte única: o número aparecia repetido em hook, regra e CSS — `17`/`13`
 * como fallback do layout e de novo no spawn de lápide, e `0.74` em três
 * arquivos TS mais oito de CSS como `74vw`. Mudar a proporção da área de jogo
 * exigia achar todas as cópias, e uma esquecida deixa a tela desalinhada.
 */

import { isPortraitViewport } from "@/utils/viewport";

/** Colunas do grid quando a cena não declara mapa próprio. */
export const MAP_GRID_COLS = 17;

/** Linhas do grid quando a cena não declara mapa próprio. */
export const MAP_GRID_ROWS = 13;

/** Fração da largura da janela ocupada pela área de jogo. */
export const GAME_VIEWPORT_WIDTH_RATIO = 0.74;

/** Nome da custom property que leva a largura da área de jogo para o CSS. */
export const GAME_VIEWPORT_WIDTH_VAR = "--game-viewport-width";

/**
 * Publica a largura da área de jogo como custom property no `:root`.
 *
 * CSS não importa constante de TS, então os `74vw` espalhados pelas folhas
 * eram cópia manual de `GAME_VIEWPORT_WIDTH_RATIO`. Escrever a variável no
 * boot inverte a dependência: o valor sai daqui e o CSS só consome.
 *
 * Em portrait a aplicação é rotacionada (landscape forçado) e o eixo
 * horizontal vira `100vh`; por isso a unidade é trocada para `vh`.
 */
export function applyGameViewportWidth(root: HTMLElement): void {
  const unit = isPortraitViewport() ? "vh" : "vw";
  root.style.setProperty(
    GAME_VIEWPORT_WIDTH_VAR,
    `${GAME_VIEWPORT_WIDTH_RATIO * 100}${unit}`,
  );

  if (!root.dataset.viewportListening) {
    root.dataset.viewportListening = "true";
    const apply = () => applyGameViewportWidth(root);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
  }
}

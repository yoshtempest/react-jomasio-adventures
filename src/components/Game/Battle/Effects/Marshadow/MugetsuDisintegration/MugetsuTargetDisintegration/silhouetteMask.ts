/** Alfa médio mínimo (0-255) para uma célula da grade contar como silhueta. */
const MIN_CELL_ALPHA = 24;

/**
 * Máscara de silhueta do sprite em espaço de grade: `1` quando a célula tem
 * pixel visível, `0` quando é fundo transparente. O picotado da desintegração
 * usa isso para não pintar quadradinhos onde não há desenho do NPC.
 *
 * O downsample usa o mesmo `drawImage` quadrado do render do sprite, então a
 * máscara bate com o que está visível. Retorna `null` quando o canvas não
 * pode ser lido (ex.: imagem cross-origin) — o chamador cai na grade cheia.
 */
export function getSilhouetteMask(
  img: HTMLImageElement,
  cols: number,
  rows: number,
): Uint8Array | null {
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.clearRect(0, 0, cols, rows);
  ctx.drawImage(img, 0, 0, cols, rows);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, cols, rows).data;
  } catch {
    return null;
  }

  const mask = new Uint8Array(cols * rows);
  for (let i = 0; i < mask.length; i++) {
    mask[i] = (data[i * 4 + 3] ?? 0) >= MIN_CELL_ALPHA ? 1 : 0;
  }
  return mask;
}

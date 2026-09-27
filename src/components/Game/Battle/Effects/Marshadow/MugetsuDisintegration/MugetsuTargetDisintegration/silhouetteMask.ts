/** Alfa mínimo (0-255) para um pixel do sprite contar como desenho. */
const MIN_SAMPLE_ALPHA = 8;

/** Lado máximo da leitura de pixels do sprite (o resto é escalado pra baixo). */
const MAX_SAMPLE_EDGE = 256;

/**
 * Máscara de silhueta do sprite em espaço de grade: `1` quando a célula
 * contém pelo menos um pixel visível, `0` quando é fundo transparente. O
 * picotado da desintegração usa isso para não pintar quadradinhos onde não há
 * desenho do NPC.
 *
 * A leitura é por pixel, não um downsample da imagem inteira: `drawImage`
 * direto para 12×12 (fator de ~40×) amostra uma fração mínima dos pixels de
 * origem e a silhueta sai furada ou com quadradinhos sobre o vazio. Aqui o
 * sprite é lido até `MAX_SAMPLE_EDGE` por lado e cada pixel marca a célula da
 * grade que ele cobre — a máscara é o máximo de cobertura, então nunca marca
 * uma célula vazia.
 *
 * Retorna `null` quando o canvas não pode ser lido (ex.: imagem cross-origin)
 * — o chamador cai na grade cheia.
 */
export function getSilhouetteMask(
  img: HTMLImageElement,
  cols: number,
  rows: number,
): Uint8Array | null {
  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;
  if (naturalW <= 0 || naturalH <= 0) return null;

  const ratio = Math.min(1, MAX_SAMPLE_EDGE / Math.max(naturalW, naturalH));
  const sampleW = Math.max(1, Math.round(naturalW * ratio));
  const sampleH = Math.max(1, Math.round(naturalH * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.clearRect(0, 0, sampleW, sampleH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, sampleW, sampleH);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, sampleW, sampleH).data;
  } catch {
    return null;
  }

  const mask = new Uint8Array(cols * rows);

  for (let y = 0; y < sampleH; y++) {
    const row = Math.min(rows - 1, ((y * rows) / sampleH) | 0);
    for (let x = 0; x < sampleW; x++) {
      const alpha = data[(y * sampleW + x) * 4 + 3] ?? 0;
      if (alpha < MIN_SAMPLE_ALPHA) continue;
      const col = Math.min(cols - 1, ((x * cols) / sampleW) | 0);
      mask[row * cols + col] = 1;
    }
  }

  return mask;
}

import { TITLE_IDS, isTitleId, type TitleId } from "@/data/titles";
import type { TitleProgress, TitlesData } from "@/utils/types/player/titles";

export function getDefaultProgress(): Partial<Record<TitleId, TitleProgress>> {
  const progress: Partial<Record<TitleId, TitleProgress>> = {};
  for (const id of TITLE_IDS) {
    progress[id] = { current: 0, level: 0 };
  }
  return progress;
}

export function getDefaultData(): TitlesData {
  return {
    equippedId: null,
    totalKills: 0,
    progress: getDefaultProgress(),
  };
}

/**
 * Normaliza o que veio do storage para a forma completa de {@link TitlesData}.
 *
 * Título é dado derivado de save antigo: progresso que não existe vira
 * `{ current: 0, level: 0 }` e `equippedId` inválido cai para `null`. Como
 * é puro, serve de `normalize` do `useCompressedStorage` (que já faz o
 * debounce da escrita e o flush em unmount/pagehide).
 */
export function normalizeData(parsed: Partial<TitlesData>): TitlesData {
  const progress = getDefaultProgress();
  if (parsed.progress) {
    for (const id of TITLE_IDS) {
      const saved = parsed.progress[id];
      if (saved) {
        progress[id] = {
          current: saved.current ?? 0,
          level: saved.level ?? 0,
        };
      }
    }
  }

  return {
    equippedId: isTitleId(parsed.equippedId) ? parsed.equippedId : null,
    totalKills: parsed.totalKills ?? 0,
    progress,
  };
}

export const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];
export const COLUMN_COUNT = 5;
export const BOTTOM_COUNT = 5;
// 5 linhas na aba "batalha": 2 toggles + intro de habilidade + treino + card.
export const BATTLE_COUNT = 5;

export function getColumnMaxIndex(column: number): number {
  if (column === 0) return 1; // card único de dificuldade (cicla com ◀/▶ ou ↑/↓)
  if (column === 1) return 1; // card único de velocidade de diálogo (cicla com ◀/▶ ou ↑/↓)
  if (column === 2) return BOTTOM_COUNT;
  return 1;
}

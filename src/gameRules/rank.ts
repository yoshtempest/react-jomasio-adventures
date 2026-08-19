export type RankId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | "EX";

export type RankInfo = {
  id: RankId;
  label: string;
};

export const RANKS: RankInfo[] = [
  { id: 1, label: "Errante" },
  { id: 2, label: "Iniciado" },
  { id: 3, label: "Adepto" },
  { id: 4, label: "Ascendente" },
  { id: 5, label: "Veterano" },
  { id: 6, label: "Elite" },
  { id: 7, label: "Lendário" },
  { id: 8, label: "Mítico" },
  { id: 9, label: "Celestial" },
  { id: 0, label: "Transcendente" },
  { id: "EX", label: "Divino" },
];

export function getRank(level: number): RankInfo {
  if (level >= 100) return RANKS[10];
  if (level >= 90) return RANKS[9];
  return RANKS[Math.floor(level / 10)];
}

export function formatRank(rank: RankInfo): string {
  return `Ranque ${rank.id} — ${rank.label}`;
}

export function getRankIndex(rank: RankInfo): number {
  return RANKS.findIndex((r) => r.id === rank.id && r.label === rank.label);
}

export function getRankMultiplier(level: number): number {
  const rank = getRank(level);
  const index = getRankIndex(rank);
  return 1 + index * 0.1;
}

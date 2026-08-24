export type RankId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | "EX";

export type RankInfo = {
  id: RankId;
  label: string;
  src?: string;
};

export const RANKS: RankInfo[] = [
  { id: 1, label: "Errante", src: "/wandering.svg" },
  { id: 2, label: "Iniciado", src: "/initiate.svg" },
  { id: 3, label: "Adepto", src: "/fan.svg" },
  { id: 4, label: "Ascendente", src: "/ascendant.svg" },
  { id: 5, label: "Veterano", src: "/senior.svg" },
  { id: 6, label: "Elite", src: "/elit.svg" },
  { id: 7, label: "Lendário", src: "/legendary.svg" },
  { id: 8, label: "Mítico", src: "/mythical.svg" },
  { id: 9, label: "Celestial", src: "/celestial.svg" },
  { id: 0, label: "Transcendente", src: "/transcendent.svg" },
  { id: "EX", label: "Divino", src: "/divine.svg" },
];

export function getRank(level: number): RankInfo {
  if (level >= 100) return RANKS[10]!;
  if (level >= 90) return RANKS[9]!;
  return RANKS[Math.floor(level / 10)]!;
}

export function formatRank(rank: RankInfo): string {
  return `Ranque ${rank.id} — ${rank.label}`;
}

export function srcRank(rank: RankInfo): string {
  return `${rank.src}`;
}

export function getRankIndex(rank: RankInfo): number {
  return RANKS.findIndex((r) => r.id === rank.id && r.label === rank.label);
}

export function getRankMultiplier(level: number): number {
  const rank = getRank(level);
  const index = getRankIndex(rank);
  return 1 + index * 0.1;
}

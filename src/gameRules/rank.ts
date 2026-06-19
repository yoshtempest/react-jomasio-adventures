export type RankId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | "EX";

export type RankInfo = {
  id: RankId;
  label: string;
};

const RANKS: RankInfo[] = [
  { id: 1, label: "Ferro" },
  { id: 2, label: "Bronze" },
  { id: 3, label: "Prata" },
  { id: 4, label: "Ouro" },
  { id: 5, label: "Platina" },
  { id: 6, label: "Esmeralda" },
  { id: 7, label: "Rubi" },
  { id: 8, label: "Safira" },
  { id: 9, label: "Diamante" },
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

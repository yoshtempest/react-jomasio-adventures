export type Stat = {
  label: string;
  value: React.ReactNode;
  progress?: number;
};

export function stat(
  label: string,
  value: React.ReactNode,
  progress?: number,
): Stat {
  return { label, value, progress };
}

export function progressStat(
  label: string,
  current: number,
  total: number,
): Stat {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return stat(label, `${current}/${total} (${percentage}%)`, percentage);
}

const XP_BUFF_KEY = "xp_buff";

type XpBuffData = {
  expiresAt: number;
  multiplier: number;
};

export function getXpBuffMultiplier(): number {
  try {
    const raw = localStorage.getItem(XP_BUFF_KEY);
    if (!raw) return 1;
    const data = JSON.parse(raw) as XpBuffData;
    if (Date.now() >= data.expiresAt) {
      localStorage.removeItem(XP_BUFF_KEY);
      return 1;
    }
    return data.multiplier;
  } catch {
    return 1;
  }
}

export function activateXpBuff(durationMs: number, multiplier: number): void {
  const data: XpBuffData = { expiresAt: Date.now() + durationMs, multiplier };
  localStorage.setItem(XP_BUFF_KEY, JSON.stringify(data));
}

export function getXpBuffTimeLeft(): number {
  try {
    const raw = localStorage.getItem(XP_BUFF_KEY);
    if (!raw) return 0;
    const data = JSON.parse(raw) as XpBuffData;
    const left = data.expiresAt - Date.now();
    return left > 0 ? left : 0;
  } catch {
    return 0;
  }
}

export const POTION_CONFIG: Record<string, { multiplier: number; durationMs: number; label: string }> = {
  xp_potion_common: { multiplier: 1.5, durationMs: 5 * 60 * 1000, label: "Comum" },
  xp_potion_rare: { multiplier: 1.75, durationMs: 10 * 60 * 1000, label: "Rara" },
  xp_potion_epic: { multiplier: 2, durationMs: 15 * 60 * 1000, label: "Épica" },
  xp_potion_boss: { multiplier: 2.5, durationMs: 20 * 60 * 1000, label: "Chefão" },
  xp_potion_legendary: { multiplier: 3, durationMs: 30 * 60 * 1000, label: "Lendária" },
};

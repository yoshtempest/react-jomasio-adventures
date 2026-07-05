const XP_BUFF_KEY = "xp_buff";

type XpBuffData = {
  expiresAt: number;
  multiplier: number;
  potionId?: string;
};

function getValidBuff(): XpBuffData | null {
  try {
    const raw = localStorage.getItem(XP_BUFF_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as XpBuffData;
    if (Date.now() >= data.expiresAt) {
      localStorage.removeItem(XP_BUFF_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function getXpBuffMultiplier(): number {
  return getValidBuff()?.multiplier ?? 1;
}

export function activateXpBuff(durationMs: number, multiplier: number, potionId?: string): void {
  const data: XpBuffData = { expiresAt: Date.now() + durationMs, multiplier, potionId };
  localStorage.setItem(XP_BUFF_KEY, JSON.stringify(data));
}

export function getXpBuffTimeLeft(): number {
  const buff = getValidBuff();
  if (!buff) return 0;
  return buff.expiresAt - Date.now();
}

export function getActivePotionId(): string | null {
  return getValidBuff()?.potionId ?? null;
}

export const POTION_CONFIG: Record<string, { multiplier: number; durationMs: number; label: string }> = {
  xp_potion_common: { multiplier: 1.5, durationMs: 5 * 60 * 1000, label: "Comum" },
  xp_potion_rare: { multiplier: 1.75, durationMs: 10 * 60 * 1000, label: "Rara" },
  xp_potion_epic: { multiplier: 2, durationMs: 15 * 60 * 1000, label: "Épica" },
  xp_potion_boss: { multiplier: 2.5, durationMs: 20 * 60 * 1000, label: "Chefão" },
  xp_potion_legendary: { multiplier: 3, durationMs: 30 * 60 * 1000, label: "Lendária" },
};

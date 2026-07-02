const XP_BUFF_KEY = "xp_buff";

type XpBuffData = {
  expiresAt: number;
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
    return 1.5;
  } catch {
    return 1;
  }
}

export function activateXpBuff(durationMs: number): void {
  const data: XpBuffData = { expiresAt: Date.now() + durationMs };
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

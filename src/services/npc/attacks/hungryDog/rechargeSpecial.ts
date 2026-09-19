import {
  SPECIAL_MAX,
  SPECIAL_RECHARGE_MS,
  type HungryDogAI,
} from "./state";


export function rechargeSpecial(ai: HungryDogAI, now: number): void {
    if (ai.specialGauge >= SPECIAL_MAX) return;
    if (ai.lastRecharge === 0) ai.lastRecharge = now;
    while (ai.lastRecharge <= now && ai.specialGauge < SPECIAL_MAX) {
      ai.lastRecharge += SPECIAL_RECHARGE_MS;
      ai.specialGauge += 1;
    }
  }
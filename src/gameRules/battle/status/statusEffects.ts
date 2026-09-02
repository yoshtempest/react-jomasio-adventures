import { ONE_THOUSAND_MS } from "@/data/ms";

type StatusUntilKey =
  | "bleedUntil"
  | "burnUntil"
  | "poisonUntil"
  | "paralyzedUntil"
  | "blindUntil"
  | "confusedUntil"
  | "frozenUntil";

export type PlayerStatus =
  "bleed" | "burn" | "poison" | "paralyze" | "blind" | "confuse" | "freeze";

export type NewPlayerStatus = Exclude<PlayerStatus, "bleed">;

export const STATUS_UNTIL_FIELD: Record<PlayerStatus, StatusUntilKey> = {
  bleed: "bleedUntil",
  burn: "burnUntil",
  poison: "poisonUntil",
  paralyze: "paralyzedUntil",
  blind: "blindUntil",
  confuse: "confusedUntil",
  freeze: "frozenUntil",
};

export const STATUS_DURATIONS_MS: Record<NewPlayerStatus, number> = {
  burn: 5000,
  poison: 5000,
  paralyze: 2000,
  blind: 2000,
  confuse: 5000,
  freeze: 2000,
};

export const STATUS_LIST: PlayerStatus[] = [
  "bleed",
  "burn",
  "poison",
  "paralyze",
  "blind",
  "confuse",
  "freeze",
];

export const BURN_TICK_DAMAGE = 2;
export const POISON_TICK_DAMAGE = 2;
export const DOT_TICK_INTERVAL_MS = ONE_THOUSAND_MS;

export function isPlayerFrozen(player: Player): boolean {
  return player.frozenUntil > Date.now();
}

export function isPlayerParalyzed(player: Player): boolean {
  return player.paralyzedUntil > Date.now();
}

export function isPlayerBlind(player: Player): boolean {
  return player.blindUntil > Date.now();
}

export function isPlayerConfused(player: Player): boolean {
  return player.confusedUntil > Date.now();
}

export function isPlayerBurning(player: Player): boolean {
  return player.burnUntil > Date.now();
}

export function isPlayerPoisoned(player: Player): boolean {
  return player.poisonUntil > Date.now();
}

export function applyPlayerStatus(
  player: Player,
  status: NewPlayerStatus,
  durationMs?: number,
): Player {
  const until = Date.now() + (durationMs ?? STATUS_DURATIONS_MS[status]);
  return { ...player, [STATUS_UNTIL_FIELD[status]]: until };
}

export type ActivePlayerStatus = {
  status: PlayerStatus;
  remaining: number;
};

export function getActivePlayerStatuses(player: Player): ActivePlayerStatus[] {
  const now = Date.now();
  const active: ActivePlayerStatus[] = [];

  for (const status of STATUS_LIST) {
    const until = player[STATUS_UNTIL_FIELD[status]];
    if (until > now) {
      active.push({ status, remaining: until - now });
    }
  }

  return active;
}

export function clearPlayerStatuses(player: Player): Player {
  return {
    ...player,
    bleedUntil: 0,
    burnUntil: 0,
    poisonUntil: 0,
    paralyzedUntil: 0,
    blindUntil: 0,
    confusedUntil: 0,
    frozenUntil: 0,
  };
}

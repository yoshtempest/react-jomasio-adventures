import { CHESTS } from "./chestItems";
import { KEYS } from "./keys";
import { TELEPORTS } from "./teleports";
import { COMMON } from "./common";
import { MAPS } from "./maps";

export const ITEMS = {
  ...CHESTS,
  ...KEYS,
  ...TELEPORTS,
  ...COMMON,
  ...MAPS,
} as const;
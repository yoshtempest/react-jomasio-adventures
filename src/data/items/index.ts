import { CHESTS } from "./chestItems";
import { KEYS } from "./keys";
import { TELEPORTS } from "./teleports";
import { COMMON } from "./common";
import { MAPS } from "./maps";
import { MOUNT } from "./mount";
import { POTIONS } from "./potions";

export const ITEMS = {
  ...CHESTS,
  ...KEYS,
  ...TELEPORTS,
  ...COMMON,
  ...MAPS,
  ...MOUNT,
  ...POTIONS,
} as const;

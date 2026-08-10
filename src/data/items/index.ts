import { CHESTS } from "./chestItems";
import { KEYS } from "./keys";
import { TELEPORTS } from "./teleports";
import { COMMON } from "./common";
import { MAPS } from "./maps";
import { POTIONS } from "./potions";
import { FOODS } from "./food";
import { COINS } from "./coins";
import { CARDS } from "./cards";

export const ITEMS = {
  ...CHESTS,
  ...KEYS,
  ...TELEPORTS,
  ...COMMON,
  ...MAPS,
  ...POTIONS,
  ...FOODS,
  ...COINS,
  ...CARDS,
} as const;

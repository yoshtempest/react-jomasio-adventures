import { CHESTS } from "./chestItems";
import { KEYS } from "./keys";
import { TELEPORTS } from "./teleports";
import { COMMON } from "./common";
import { MAPS } from "./maps";
import { POTIONS } from "./potions";
import { FOODS } from "./food";
import { ENERGETICS } from "./energetics";
import { COINS } from "./coins";
import { CARDS } from "./cards";
import { MATERIALS } from "./materials";

export const ITEMS = {
  ...CHESTS,
  ...KEYS,
  ...TELEPORTS,
  ...COMMON,
  ...MAPS,
  ...POTIONS,
  ...FOODS,
  ...ENERGETICS,
  ...COINS,
  ...CARDS,
  ...MATERIALS,
} as const;

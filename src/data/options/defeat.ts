import type { DefeatMenuSelection } from "@/utils/types/battle/defeat";

export const DEFEAT_MENU_NEXT: Record<DefeatMenuSelection, DefeatMenuSelection> = {
  retry: "flee",
  flee: "characterSelect",
  characterSelect: "retry",
};

export const DEFEAT_MENU_PREV: Record<DefeatMenuSelection, DefeatMenuSelection> = {
  retry: "characterSelect",
  characterSelect: "flee",
  flee: "retry",
};
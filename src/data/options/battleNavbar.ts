import { navbarIconPath } from "@/utils/paths";

export const BATTLE_NAVBAR_OPTIONS = [
  {
    icon: navbarIconPath("character.svg"),
    label: "Personagens",
    screen: "characters",
    confirmSfx: "chooseYourCharacter",
  },
  {
    icon: navbarIconPath("backpack.svg"),
    label: "Inventário",
    screen: "inventory",
  },
  {
    icon: navbarIconPath("configs.svg"),
    label: "Configurações",
    screen: "settings",
  },
] as const;

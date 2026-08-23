export const BATTLE_NAVBAR_OPTIONS = [
  {
    icon: "/assets/navbar/character.svg",
    label: "Personagens",
    screen: "characters",
    confirmSfx: "chooseYourCharacter",
  },
  {
    icon: "/assets/navbar/backpack.svg",
    label: "Inventário",
    screen: "inventory",
  },
  {
    icon: "/assets/navbar/configs.svg",
    label: "Configurações",
    screen: "settings",
  },
] as const;

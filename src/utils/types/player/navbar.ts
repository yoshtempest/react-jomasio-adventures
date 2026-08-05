export type NavScreen =
  | "menu"
  | "character"
  | "status"
  | "inventory"
  | "config"
  | "missions"
  | "equipment"
  | "titles"
  | "bestiary"
  | "player"
  | "saves"
  | "professions"
  | "pets";

export type NavbarOption = {
  icon: string;
  label: string;
  screen: NavScreen;
};

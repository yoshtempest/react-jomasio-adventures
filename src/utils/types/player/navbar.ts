export type NavScreen =
  | "menu"
  | "character"
  | "status"
  | "inventory"
  | "config"
  | "missions"
  | "equipment"
  | "titles"
  | "bestiary";

export type NavbarOption = {
  label: string;
  screen: NavScreen;
};

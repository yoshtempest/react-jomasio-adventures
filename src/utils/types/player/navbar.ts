export type NavScreen = "menu" | "character" | "status" | "inventory" | "config" | "missions" | "equipment";

export type NavbarOption = {
  label: string;
  screen: NavScreen;
};
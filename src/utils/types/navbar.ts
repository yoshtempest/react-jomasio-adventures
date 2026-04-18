export type NavScreen = "menu" | "character" | "inventory" | "config";

export type NavbarOption = {
  label: string;
  screen: NavScreen;
};
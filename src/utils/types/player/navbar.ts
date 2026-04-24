export type NavScreen = "menu" | "character" | "status" | "inventory" | "config";

export type NavbarOption = {
  label: string;
  screen: NavScreen;
};
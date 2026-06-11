export type NavScreen = "menu" | "character" | "status" | "inventory" | "config" | "missions" | "equipment" | "titles";

export type NavbarOption = {
  label: string;
  screen: NavScreen;
};
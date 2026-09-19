import type { NAVBAR_OPTIONS } from "@/data/options/navbar";
import type { SoundId } from "@/utils/audio/soundId";

export type MenuScreen = (typeof NAVBAR_OPTIONS)[number]["screen"];

export type NavScreen = "menu" | MenuScreen;

export type NavbarOption = {
  icon: string;
  label: string;
  screen: MenuScreen;
  confirmSfx?: SoundId;
};

import {
  UI_BUTTON_L_COOLDOWN,
  UI_BUTTON_B_COOLDOWN,
  UI_BUTTON_G_COOLDOWN,
  UI_BUTTON_ESC_COOLDOWN,
} from "@/data/cooldowns";

export type UIButtonType = "confirm" | "cancel" | "open" | "config";

export const UI_BUTTON_COOLDOWNS: Record<UIButtonType, number> = {
  confirm: UI_BUTTON_L_COOLDOWN,
  cancel: UI_BUTTON_B_COOLDOWN,
  open: UI_BUTTON_G_COOLDOWN,
  config: UI_BUTTON_ESC_COOLDOWN,
};

export const UI_BUTTON_KEYS: {
  key: string;
  id: UIButtonType;
  preventDefault?: boolean;
}[] = [
  { key: "l", id: "confirm" },
  { key: "L", id: "confirm" },
  { key: "A", id: "confirm" },
  { key: "Enter", id: "confirm" },

  { key: "b", id: "cancel" },
  { key: "B", id: "cancel" },
  { key: "x", id: "cancel" },
  { key: "X", id: "cancel" },
  { key: "Delete", id: "cancel" },

  { key: "g", id: "open", preventDefault: true },
  { key: "G", id: "open", preventDefault: true },
  { key: "Tab", id: "open", preventDefault: true },

  { key: "Escape", id: "config" },
];

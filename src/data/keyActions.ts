import type { MenuScreen } from "@/utils/types/player/navbar";

type GameControlAction =
  | "onConfirm"
  | "onCancel"
  | "onOpen"
  | "onUp"
  | "onDown"
  | "onLeft"
  | "onRight"
  | "onConfirmRelease"
  | "onCancelRelease"
  | "onUpRelease"
  | "onDownRelease"
  | "onLeftRelease"
  | "onRightRelease";

export const KEY_ACTIONS: Record<string, GameControlAction> = {
  ArrowUp: "onUp",
  w: "onUp",
  W: "onUp",
  " ": "onUp",

  ArrowDown: "onDown",
  s: "onDown",
  S: "onDown",

  ArrowLeft: "onLeft",
  a: "onLeft",
  A: "onLeft",

  ArrowRight: "onRight",
  d: "onRight",
  D: "onRight",

  l: "onConfirm",
  L: "onConfirm",
  Enter: "onConfirm",

  b: "onCancel",
  B: "onCancel",
  x: "onCancel",
  X: "onCancel",
  Delete: "onCancel",
};

export const KEY_RELEASE_ACTIONS: Record<string, GameControlAction> = {
  ArrowUp: "onUpRelease",
  w: "onUpRelease",
  W: "onUpRelease",
  " ": "onUpRelease",

  ArrowDown: "onDownRelease",
  s: "onDownRelease",
  S: "onDownRelease",

  ArrowLeft: "onLeftRelease",
  a: "onLeftRelease",
  A: "onLeftRelease",

  ArrowRight: "onRightRelease",
  d: "onRightRelease",
  D: "onRightRelease",

  l: "onConfirmRelease",
  L: "onConfirmRelease",
  Enter: "onConfirmRelease",

  b: "onCancelRelease",
  B: "onCancelRelease",
  x: "onCancelRelease",
  X: "onCancelRelease",
  Delete: "onCancelRelease",
};

export const SCREEN_SHORTCUT_KEYS: Partial<Record<string, MenuScreen>> = {
  Escape: "config",
  i: "inventory",
  I: "inventory",
  q: "missions",
  Q: "missions",
  p: "professions",
  P: "professions",
  t: "titles",
  T: "titles",
  e: "equipment",
  E: "equipment",
};

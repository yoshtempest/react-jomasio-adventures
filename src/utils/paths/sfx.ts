import { soundEffectPath } from "./soundEffectPath";

export function sfx(path: string) {
  return new Audio(soundEffectPath(`/${path}`));
}

import { asset } from "./asset";

export function soundEffectPath(path: string) {
  return asset(`/assets/songs/soundEffects/${path}`);
}

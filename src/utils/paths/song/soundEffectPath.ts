import { asset } from "@/utils/paths/asset";

export function soundEffectPath(path: string) {
  return asset(`/assets/songs/soundEffects/${path}`);
}

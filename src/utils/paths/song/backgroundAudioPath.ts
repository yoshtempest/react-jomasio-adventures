import { asset } from "@/utils/paths/asset";

export function backgroundAudioPath(path: string) {
  return asset(`/assets/songs/background/${path}`);
}

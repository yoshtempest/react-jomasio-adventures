import { asset } from "./asset";

export function backgroundAudioPath(path: string) {
  return asset(`/assets/songs/background/${path}`);
}

import { asset } from "./asset";

export function videoPath(name: string): string {
  return asset(`/assets/videos/${name}`);
}

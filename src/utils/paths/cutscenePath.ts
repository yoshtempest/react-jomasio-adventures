import { asset } from "./asset";

export function cutscenePath(name: string): string {
  return asset(`/assets/history/cutscenes/${name}`);
}

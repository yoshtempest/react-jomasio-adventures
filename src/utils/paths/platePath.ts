import { asset } from "./asset";

export function platePath(name: string): string {
  return asset(`/assets/plates/${name}`);
}

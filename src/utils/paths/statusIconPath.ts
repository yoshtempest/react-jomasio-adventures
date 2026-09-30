import { asset } from "./asset";

export function statusIconPath(name: string): string {
  return asset(`/assets/status/${name}`);
}

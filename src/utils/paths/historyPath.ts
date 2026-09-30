import { asset } from "./asset";

export function historyPath(name: string): string {
  return asset(`/assets/history/${name}`);
}

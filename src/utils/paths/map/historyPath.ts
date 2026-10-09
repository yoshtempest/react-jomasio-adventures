import { asset } from "@/utils/paths/asset";

export function historyPath(name: string): string {
  return asset(`/assets/history/${name}`);
}

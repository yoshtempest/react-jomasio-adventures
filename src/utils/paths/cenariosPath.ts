import { asset } from "./asset";

export function cenariosPath(path: string) {
  return asset(`/assets/cenarios/${path}`);
}

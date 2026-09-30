import { asset } from "./asset";

/** Efeitos visuais compartilhados (usados por qualquer personagem/NPC). */
export function effectsPath(path: string) {
  return asset(`/assets/effects/${path}`);
}

import { sfx } from "./sfx";

export function playerSoundPath(path: string) {
  return sfx(`player/${path}`);
}

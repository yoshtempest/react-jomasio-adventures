import { playerSoundPath } from "./playerSoundPath";

export function useItemPath(path: string) {
  return playerSoundPath(`useItem/${path}`);
}

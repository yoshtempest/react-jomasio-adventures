import type { NavigateFunction, Location } from "react-router";

export type ExitTileOptions = {
  scene: SceneConfig;
  player: Player;
  quests: Quest[];
  navigateWithFade: (to: string, options?: { state?: unknown }) => void;
  location: Location;
  handleExit?: (ctx: {
    player: Player;
    scene: SceneConfig;
    navigate: NavigateFunction;
    location: Location;
    quests: Quest[];
  }) => boolean;
  setPopup?: (msg: string | null) => void;
};

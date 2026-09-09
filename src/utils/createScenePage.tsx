import type { ComponentType } from "react";

import ScenePage from "@/components/Game/Scenes/ScenePage";

type SceneComponent = ComponentType<{ sceneId: SceneId }>;

export function createScenePage(Scene: SceneComponent) {
  function ScenePageRoute() {
    return <ScenePage SceneComponent={Scene} />;
  }
  return ScenePageRoute;
}
